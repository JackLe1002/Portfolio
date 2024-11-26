# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

from sentence_transformers import SentenceTransformer, util
import torch

import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()
SERVER_URL = os.getenv("SERVER_URL")

def load_nested_services():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_dir, "nested_services.json")
    with open(filename, "r") as file:
        data = json.load(file)
    return data


def load_timelines():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_dir, "timelines.json")
    with open(filename, "r") as file:
        data = json.load(file)
    return data


# Initialize the data
nested_services_data = load_nested_services()
timelines_data = load_timelines()


def get_parent_services():
    return [service["pName"] for service in nested_services_data["data"]]


def get_parent_domains():
    return [' '.join(service["pDomain"]) for service in nested_services_data["data"]]


def get_child_services(parent_service):
    for service in nested_services_data["data"]:
        if service["pName"] == parent_service:
            return [child["cName"] for child in service["childServices"]]


def get_child_id(parent_service, child_service):
    for service in nested_services_data["data"]:
        if service["pName"] == parent_service:
            for child in service["childServices"]:
                if child["cName"] == child_service:
                    return child["id"]
    return None


def get_timelines():
    return [time["title"] for time in timelines_data["data"]]


def get_timeline_id(timeline):
    for time in timelines_data["data"]:
        if time["title"] == timeline:
            return time["id"]
    return None


class ModelSingleton:

    _instance = None
    all_services = {}
    parent_services_embeddings = None
    parent_domains_embeddings = None
    child_services_embeddings = {}
    timeline_embeddings = None

    @classmethod
    def get_instance(cls):
        """Returns the singleton instance, loading the model and embeddings if not already done."""
        if cls._instance is None:
            cls._instance = SentenceTransformer('all-MiniLM-L6-v2')
            cls._load_and_cache_data()
            cls._load_and_cache_embeddings()
        return cls._instance

    @classmethod
    def _load_and_cache_data(cls):
        """Loads and caches all services."""
        cls.all_services = load_nested_services()

    @classmethod
    def _load_and_cache_embeddings(cls):
        """Loads and caches embeddings for parent and child services."""
        parent_domains = get_parent_domains()
        cls.parent_domains_embeddings = cls._instance.encode(parent_domains, convert_to_tensor=True)

        ############################################################
        # TO-DO: Can remove this part as it's not being used anywhere
        ############################################################
        parent_services = get_parent_services()
        cls.parent_services_embeddings = cls._instance.encode(parent_services, convert_to_tensor=True)

        for service in parent_services:
            child_services = get_child_services(service)
            if child_services:
                cls.child_services_embeddings[service] = cls._instance.encode(child_services, convert_to_tensor=True)

        timelines = get_timelines()
        cls.timeline_embeddings = cls._instance.encode(timelines, convert_to_tensor=True)

    @classmethod
    def initialize(cls):
        """Initializes the model and caches embeddings, ensuring they're loaded on server startup."""
        cls.get_instance()


class ActionCreateService(Action):
    def name(self) -> Text:
        return "action_create_service"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_token = tracker.sender_id
        property_id = tracker.latest_message.get('metadata', {}).get('propertyId')
        timeline_id = get_timeline_id(tracker.get_slot('timeline'))
        service_type_id = get_child_id(tracker.get_slot('best_parent'), tracker.get_slot('best_child'))
        issue_detail = tracker.get_slot('issue_detail')

        create_request_body = {
            "propertyId": property_id,
            "timelineId": timeline_id,
            "serviceTypeId": service_type_id,
            "detail": issue_detail
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {user_token}"
        }
        ########################################
        # TO-DO: Replace with dynamic URL
        # Maybe use .env file to store the URL
        ########################################
        if SERVER_URL is not None:
            try:
                response = requests.post(f"{SERVER_URL}/ticket/initiated", json=create_request_body,
                                         headers=headers)
                response.raise_for_status()
                response_data = response.json()

                if response_data.get("isSuccess"):
                    dispatcher.utter_message(text="This service request is created successfully.")
                    dispatcher.utter_message(text="Is there anything else I can help with?.")

                else:
                    dispatcher.utter_message(text=response_data.get("message", "Failed to create request"))
            except requests.exceptions.RequestException as e:
                dispatcher.utter_message(text="Failed to create service request due to an error.")
                print(e)
        else:
            print("SERVER_URL is not set")
        return []


class ActionFindBestService(Action):
    def name(self):
        return "action_find_best_service"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        user_description = tracker.latest_message['text']
        model = ModelSingleton.get_instance()

        parent_domains_embeddings = ModelSingleton.parent_domains_embeddings

        parent_services = get_parent_services()

        parent_domains = get_parent_domains()

        user_description_embedding = model.encode(user_description, convert_to_tensor=True)

        cosine_scores = util.pytorch_cos_sim(user_description_embedding, parent_domains_embeddings)

        highest_score_index = cosine_scores.argmax()
        best_parent = parent_services[highest_score_index]

        print("parent: ", best_parent, "domain:", parent_domains[highest_score_index])

        child_services_embeddings = ModelSingleton.child_services_embeddings.get(best_parent, torch.Tensor())

        if child_services_embeddings.numel() > 0:
            cosine_scores = util.pytorch_cos_sim(user_description_embedding, child_services_embeddings)
            highest_score_index = cosine_scores.argmax()
            child_services = get_child_services(best_parent)
            best_child = child_services[highest_score_index]
        else:
            best_child = "No child services found"

        dispatcher.utter_message(text=f"It looks like you need help with {best_parent} and maybe {best_child}.")

        return [SlotSet("best_parent", best_parent), SlotSet("best_child", best_child), SlotSet("issue_detail", user_description), SlotSet("timeline", "As soon as possible")]


class ActionFindTime(Action):
    def name(self):
        return "action_find_time"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):

        user_description = tracker.latest_message['text']
        model = ModelSingleton.get_instance()

        timeline_embeddings = ModelSingleton.timeline_embeddings
        timelines = get_timelines()

        user_description_embedding = model.encode(user_description, convert_to_tensor=True)

        cosine_scores = util.pytorch_cos_sim(user_description_embedding, timeline_embeddings)

        highest_score_index = cosine_scores.argmax()
        best_time = timelines[highest_score_index]

        dispatcher.utter_message(text=f"Okay, I will have request created for {best_time} timeline. Does it look good?")

        return [SlotSet("timeline", best_time)]


ModelSingleton.initialize()
