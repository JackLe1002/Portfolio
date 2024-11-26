#!/bin/bash

source activate homie

sed -i "s|  url: http://0.0.0.0:5055/webhook|  url: $ACTIONS_URL|" endpoints.yml

conda list

rasa --version

rasa train

rasa run -m models --enable-api --cors '*' --debug