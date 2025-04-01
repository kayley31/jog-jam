# Welcome to the Jog Jam App

## Overview

For our final project, we have created an app called ‘Jog Jam’ which generates music playlists for runners. We chose this project as it allowed us to put into practice the skills we have learned throughout the degree, while pushing us beyond our initial skill set. The project aims to create a fully functioning React application that is cohesive and scalable, while satisfying a potential gap in the market for people who listen to music while they run.


## How to run the app

### Running the Node Server
Get the Node server up and running by:

1) Navigating to the node-server folder:

    ```
    cd ./spotify-app/node-server
    ```
2) Running the following in the terminal to install config which holds the Spotify credentials:
    ```
    npm install dotenv
    ```
3) Then run the following in your terminal to start the Node server:
    ```
    node server.js
    ```

If this step is successful, you should see "Server is running on port 3001" in the terminal.

### Running the React Application

Get the React application up and running by:

1) Opening a new terminal and navigating into the running-app folder:

    ```
    cd ./group4/spotify-app/running-app
    ```
2) Installing all dependancies:
    ```
    npm install
    ```
4) Starting the application:
    ```
    npm start
    ```

If this is successful you should now be able to see the application running locally at:

http://localhost:3000
