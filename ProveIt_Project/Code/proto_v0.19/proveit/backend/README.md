# HomeTrumpeter Proxy Server

## Tech Stack

- Express
- JavaScript
- nodemailer
- nodemon(development)

## Building the project

Requirements:

- [Node.js (LTS)](https://nodejs.org/en)

### Setting up development environment

1. Install all dependencies\
   `npm install`

3.  Run the dev environment\
    `npm run dev`

### Building for production

1. Install all dependencies\
   `npm install`

2. Run the production server\
   `node index.js`

# File structure

```
/
├── controllers
├   └── (controllers)
├── server-configs
├   └── k8s(for deployment)
└── routes
    └── index.js(routes)
```

# Environment Variables

You must have the `.env` file in the **root directory**.

```
/
├── .env    -> place the file here
├── index.js
└── ...
```

The .env file should contain the following text:

```
API_TOKEN=<HT_API_KEY>
PORT=5000
# use any port but 5000 remomended

FRONT_URL=http://localhost:5173 (URL of the frontend service)
HOMIE_URL=http://0.0.0.0:5005 (URL of the Chatbot service)

OAUTH_CLIENT_ID=<from google cloud>
OAUTH_CLIENT_SECRET=<from google cloud>
OAUTH_REFRESH_TOKEN=<from google cloud>
```
