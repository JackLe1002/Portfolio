# HomeTrumpeter Chatbot

## Tech Stack

- Python 3.9
- Environment Manager (Conda recommended)
- Rasa
- PyTorch
- TensorFlow

## Building the Project

### Requirements:

Ensure you have Python 3.9 installed on your system. This project also requires an environment manager; Conda is recommended for ease of setup.

### Setting Up the Development Environment

1. **Create a Virtual Environment**: Using Conda, create a new environment to isolate the project dependencies.

   ```bash
   conda create --name home_trumpeter python=3.9
   conda activate home_trumpeter

2. Install dependencies\
    `pip install -r requirements.txt`


3. Install rasa\
    `pip install rasa`


4. Run the Development Environment\
    `rasa shell`

### Building for production
To train your model from scratch for production use, run:\
`rasa train --force`


# File structure

```
/
├── actions            -> Custom actions directory
├── data               -> Training data for the Rasa model
│   ├── nlu.yml        -> NLU training data
│   └── stories.yml    -> Stories for the Rasa Core
├── models             -> Trained model files
├── tests              -> Test files
├── config.yml         -> Configuration file for Rasa NLU and Rasa Core
├── domain.yml         -> Domain file describing the model domain
├── credentials.yml    -> Credentials for integrations
├── endpoints.yml      -> Endpoint configurations
└── assets             -> Logos, photos, fonts, etc.

```

# Environment Variables

One `.env` files inside the the **actions directory**.

```
/
├── data
└── actions
    └── .env    -> place the file here
    └── actions.py
```

The .env file should contain the following text:

```
SERVER_URL=http://localhost:5000 (URL of the backend service)
```