__author__ = "Arshjot Ghuman"

import json
import os
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
nltk.download('stopwords')
nltk.download('punkt')


def load_nested_services():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(current_dir, "nested_services.json")
    with open(filename, "r") as file:
        data = json.load(file)
    return data


nested_services_data = load_nested_services()


def get_parent_services():
    return [service["pName"] for service in nested_services_data["data"]]


def get_child_services(parent_service):
    for service in nested_services_data["data"]:
        if service["pName"] == parent_service:
            return [child["cName"] for child in service["childServices"]]


data = load_nested_services()


def make_domain(service, features):
    for p_service in data["data"]:
        if p_service["pName"] == service:
            p_service["pDomain"] = list(features)


def make_domain_file():
    filename = "services_domain.json"
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


parent_services = get_parent_services()

for service in parent_services:

    child_services = get_child_services(service)
    combined_text = " ".join(child_services)

    tokens = word_tokenize(combined_text.lower())

    filtered_tokens = [word for word in tokens if word not in stopwords.words('english') and word.isalpha()]

    vectorizer = TfidfVectorizer(max_features=20, stop_words=stopwords.words('english'))

    tfidf_matrix = vectorizer.fit_transform([' '.join(filtered_tokens)])

    feature_names = vectorizer.get_feature_names_out()

    make_domain(service, feature_names)

make_domain_file()
