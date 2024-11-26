# BOTH FRONTEND AND BACKEND MUST BE RUNNING AT THE SAME TIME, USE 2 DIFFERENT TERMINAL

1.  Clone repository

- SSH: `git clone -b develop-feature-backend-login git@gitlab.com:ht6401839/uofw/proveit.git`
- HTTPS: `git clone -b develop-feature-backend-login https://gitlab.com/ht6401839/uofw/proveit.git`

2.  Terminal 1 - frontend
    ```
    cd frontend
    npm install
    npm run dev
    ```

3.  Terminal 2 - backend
    ```
    cd backend
    npm install
    node index.js
    ```

# Dependencies in backend
- express
- axios
- body-parser
- cors
- dotenv

# File structure

```
/
├── backend
└── frontend
```

# API access

We are storing the API key locally in the environment variables to improve security and reduce risks.
You can find the API key in the video that HomeTrumpeter shared on Google Drive.\
\
You must have the `.env` file in the /backend.

```
/
└── backend
    └── .env    -> place the file here
```

The .env file should contain the following text:

```
API_TOKEN=<insert API key>
```
