# HomeTrumpeter Mobile App

## Tech Stack

- React Native
- TypeScript
- Expo

## Building the project

Requirements:

- [Node.js (LTS)](https://nodejs.org/en)
- Android Studio (Android development)
- XCode (iOS development)

### Setting up development environment

1. Install all dependencies\
   `npm install`

3.  Run the dev environment\
    `npx expo strat -c`

### Building for production

Currently, the project setup for building for production using Expo hasn't been detailed. For native development or when you're ready to prepare a production build, you will need to eject from Expo managed workflow to bare workflow. This allows you to configure native code and build your app directly.\
`expo eject`
# File structure

```
/
├── assets            -> Static files like images, fonts, etc.
└── src
    ├── contexts      -> Contexts for state management
    ├── hooks         -> Custom React hooks
    ├── navigation    -> Navigation setup and stack
    └── screens       -> UI screens of the app

```

# Environment Variables

You must have the `.env` file in the **root directory**.

```
/
├── .env    -> Environment variables file
├── assets
└── src
    └── ...

```

The .env file should contain the following text:

```
SERVER_URL_IOS=http://localhost:5000 (URL for backend service)
SERVER_URL_ANDROID=http://10.0.2.2:5000 (URL for backend service)
```
Replace localhost with your actual development server's IP address if you're testing on a real device and your server is not hosted on the same machine.
