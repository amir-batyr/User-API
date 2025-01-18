# User Sign In/Sign up API

Writen by Amir Batyrov.
With the help of Javascript ALL-IN-ONE Book by Chris Minnick

## How to use

1. [Download REST Client for VS Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. [Download and Setup MongoDB server](https://www.mongodb.com/try/download/community)
3. Modify **./src/app.js** to connect to your MongoDB Database
4. Change the name of **./example_env** to **.env** and ==CHANGE THE ACCESS_TOKEN_SECRET VARIABLE TO ANY RANDOM STRING AT LEAST 32 CHAR LONG!==
5. Run `npm start` in terminal
6. Use the **./api/example.http** with REST Client to send HTTP requests

## For Developers

### ./src/routes

Contains login/protected routes (Most important!)

### ./src/app.js

Databese connection and Routes setup

### ./src/server.js

Server launch

### ./models

MongoDB models
