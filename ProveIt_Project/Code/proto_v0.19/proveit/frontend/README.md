# HomeTrumpeter Website

## Tech Stack

- React
- TypeScript
- Vite(development)
- Serve(production)

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

2. Run the build command - your files will appear in the `/dist` folder\
    `npm run build`

# File structure

```
/
├── public
└── src
    ├── assets      -> logos, photos, fonts, etc.
    ├── components  -> nav bar, buttons, text box, etc.
    ├── routes      -> pages that will be accessed by URL (1 .tsx file per page)
    └── styles      -> stylesheets
```

# Environment Variables

You must have the `.env` file in the **root directory**.

```
/
├── .env    -> place the file here
├── public
└── src
    └── ...
```

The .env file should contain the following text:

```
VITE_SERVER=http://localhost:5000 (URL of the backend service)
```
