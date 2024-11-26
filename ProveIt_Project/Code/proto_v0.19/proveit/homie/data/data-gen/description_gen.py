"""
Generate human-like service request descriptions.

TO-DO:
- Add restrictions for max tokens and other parameters.
- Add more service types and timelines.
"""

__author__ = "Arshjot Ghuman"

from openai import OpenAI
import json
import csv

client = OpenAI(api_key="")

service_filename = "../nested_services.json"
timeline_filename = "../timelines.json"

output_file = "service_descriptions.csv"

with open(service_filename, "r") as file:
    data = json.load(file)

service_types = [child["cName"] for parent in data["data"] for child in parent["childServices"]]

with open(timeline_filename, "r") as file:
    timelines = json.load(file)

timelines = [time["title"] for time in timelines["data"]]

service_types = service_types[:2]
timelines = timelines[:2]

num_responses = 3

with open(output_file, "w") as file:
    writer = csv.writer(file)

    for service in service_types:
        for timeline in timelines:
            prompt = f"Generate a sentence for a person if they want '{service}' service in '{timeline}' timeline."
            response = client.completions.create(model="gpt-3.5-turbo-instruct",
                                                 prompt=prompt,
                                                 max_tokens=45,
                                                 n=num_responses)

            for i in range(num_responses):
                description = response.choices[i].text.strip().replace("\n", " ")
                writer.writerow([service, timeline, description])
