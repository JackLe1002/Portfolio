"""
Modify the JSON data to nest the child services under their parent services.

"""
__author__ = "Arshjot Ghuman"

import json

# from
file_path = 'AllServicesJSON.json'
# to
filename = 'nested_services.json'

def modify_service(service, is_child=False):
    """
    Remove unnecessary fields from service object and
    rename types.
    """

    service.pop("createdAt", None)
    service.pop("isApproved", None)

    service_type = service.pop("serviceType")
    if is_child:
        service["cName"] = service_type
    else:
        service["pName"] = service_type

    return service


def remove_id(service):
    """
    Remove the id field from the service object.
    """

    print(service["cName"])
    service.pop("parentId", None)
    return service


with open(file_path, "r") as file:
    data = json.load(file)

parent_services = [modify_service(s) for s in data["data"] if "parentId" not in s]
child_services = [modify_service(s, is_child=True) for s in data["data"] if "parentId" in s]

for parent in parent_services:
    parent["childServices"] = [remove_id(child) for child in child_services if child.get("parentId") == parent["id"]]

nested_services = {"data": parent_services}

with open(filename, "w") as file:
    json.dump(nested_services, file, indent=4)

print("Nested services saved to", filename)
