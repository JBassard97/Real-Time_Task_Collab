# Real-Time_Task_Collab

## Table of Contents
- [About the Project](#about-the-project)
  - [Built With](#built-with)
  - [Deployed On](#deployed-on)
- [Features](#features)
- [Usage](#usage)
  - [Live App](#live-app)
  - [Running Locally](#running-locally)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install and Build](#2-install-and-build)
    - [3. Start Development Servers](#3-start-development-servers)
- [Demonstrations](#demonstrations)
  - [Screenshots](#screenshots)
  - [Videos](#videos)
- [My Thought Process](#my-thought-process)
  - [1. Project Initialization](#1-project-initialization)
  - [2. Exploring WebSocket Integration](#2-exploring-websocket-integration)
  - [3. Building the WebSocket Server](#3-building-the-websocket-server)
  - [4. Frontend Integration with Socket.IO Client](#4-frontend-integration-with-socketio-client)
  - [5. Extending Functionality](#5-extending-functionality)
  - [6. Deployment Journey](#6-deployment-journey)
- [About the Creator](#about-the-creator)
  - [Contact Me](#contact-me)



## About the Project

A deployed web app with a WebSocket server that allows users to join rooms and create, complete, and delete tasks in real time.

[View on GitHub](https://github.com/JBassard97/Real-Time_Task_Collab)

[View Live App](https://real-time-task-collab.onrender.com/)

### Built With

- [React](https://reactjs.org/)
- [Vite](https://vite.dev/)
- [Express](https://expressjs.com/en/5x/api.html)
- [Node.js](https://nodejs.org/)
- [Socket.IO](https://socket.io/)

### Deployed On

- [Render](https://render.com/docs)

## Features

This application allows users to:
- View and edit a real-time, updated, shared list of tasks, and be able to:
  - Create tasks
  - View who created the task
  - Mark task as complete
  - Undo marking a task as completed
  - Delete tasks
- Traverse between rooms at will

## Usage

### Live App

The easiest way to use this application is to [visit the live site](https://real-time-task-collab.onrender.com/), hosted by Render.

### Running Locally

To run the application, you will need to have the following installed:
- [Node.js](https://nodejs.org/en)
- [GitBash for Windows](https://git-scm.com/) or any terminal configured with [Git](https://git-scm.com/)

#### 1. Clone the Repository

In your Git-compatible terminal, navigate to the directory you want to put this in, and enter the command to clone the project:

`git clone git@github.com:JBassard97/Real-Time_Task_Collab.git`

#### 2. Install and Build

You will now want to install all of the dependencies for the application, so `cd` into the newly cloned repo and enther the command: `npm run final-build`. This will effortlessly install all of the packages needed for the client and server, and it will perform Vite's build command in the client.

#### 3. Start Development Servers

With all of the dependencies installed and the React Front End built, we can run the WebSocket Server and Vite Servers simultaneously with the command: `npm run develop`. You'll then be greeted by the following in your terminal:

IMAGE HERE

Navigate to the localhost address given by Vite and you have access to the full application! You can also take advantage of Vite's HMR (Hot Module Reloading) system and any changes made in the code will be immediately reflected in the browser.

## Demonstrations

### Screenshots

FILL IN LATER

### Videos

FILL IN LATER

## My Thought Process

### 1. Project Initialization

- Created a GitHub repository with an accurate name and project description.
- Initialized a React project using Vite and TypeScript with the command: 
```bash
npm create vite@latest real-time-task-collab
```
- Removed boilerplate code and set up the Vite development server 
- Modified `vite.config.ts` to include the following property:
```typescript
server: { open: true }
```

  This configuration ensured the app opened in the browser automatically upon server startup, streamlining development.

### 2. Exploring WebSocket Integration

- Researched WebSocket implementations, focusing on Socket.IO as a tool of choice.
- Followed the official Socket.IO documentation to create a WebSocket server.
- Tested the server locally by running the starter code, successfully observing "User connected" in the terminal.
- Encountered the need to run both Vite and the WebSocket server simultaneously, prompting the installation of the `concurrently` package with:
``` bash
npm install concurrently --save-dev
```
- Updated the package.json scripts to use `concurrently`:
``` bash
"dev": "concurrently \\"node server.cjs\\" \\"vite\\""
```

### 3. Building the WebSocket Server

- Leveraged custom events for task management:
  - Defined events like `addTask`, `completeTask`, and `deleteTask` to handle updates.
  - Used `socket.on` to listen for events from clients.
  - Applied `io.emit` to broadcast updates to all connected clients.
- Implemented in-memory storage for tasks, ensuring the server could synchronize the task list with new clients in real time.
- Experimented with emitting and receiving custom events, validating the system's real-time capabilities.

### 4. Frontend Integration with Socket.IO Client
- Installed the Socket.IO Client library:
  ```bash
  npm install socket.io-client
  ```
- Initialized a WebSocket connection in React:
  ```javascript
  const socket = io("ws://localhost:3001");
  ```
- Utilized the `socket.on` method to listen for server-side events:
  ```javascript
  socket.on("tasks", (updatedTasks) => {
    setTasks(updatedTasks);
  });
  ```
  - This ensured the task list remained synchronized across all clients.
- Enabled client-side event emission for real-time interactions:
  - Example: Emitting an `addTask` event with task data:
    ```javascript
    socket.emit("addTask", task);
    ```


### 5. Extending Functionality

- Implemented toggleable task completion:
  - Enhanced the task completion system to allow users to toggle between completed and incomplete states.
  - Modified the completeTask event handler to check the current completion status:
  ``` javascript
  socket.emit("toggleComplete", {
    taskId,
    currentStatus: task.completed
  });
  ```
  - Updated the UI to reflect completion status with visual indicators and interactive elements.
  - Enabled users to undo task completion by clicking on completed tasks.
- Developed a room-based collaboration system:
  - Created distinct spaces through Socket.IO rooms.
  - Implemented room joining/leaving functionality:
  ``` javascript
  socket.emit("joinRoom", roomName);
  socket.emit("leaveRoom", currentRoom);
  ```
  - Maintained separate task lists for each room.
  - Added room-specific broadcasting to ensure updates only reach relevant users:
  ``` javascript
  io.to(roomName).emit("tasks", roomTasks[roomName]);
  ```
- Enhanced the user experience by displaying current room information and available rooms.
- Enabled seamless room switching while maintaining real-time synchronization.

### 6. Deployment Journey
- My initial deployment attempt was with Netlify, which made sense since I had just successfully deployed a Next.js app there. 
- To my dismay, it didn't have the support to run a server start command like I needed. So I went with my personal option 2: Render.
- Render was able to successfully build and deploy my application, but when I went to view it, the content wasn't showing. 
- That's when I realized that the dist/index.html wasn't actually being served, and my server needed to handle that as well. 
- I upgraded the WebSocket server with a simple HTTP server.
- One last time I built and tested it locally and everything worked, triggered another deploy in Render, and everything clicked just right. MVP Achieved. 


## About the Creator

Jonathan Acciarito is Full Stack Web Developer with 5 years of experience and a foundation from the Coding Bootcamp at University of Chapel Hill.

He specialize in the MERN stack (MongoDB, Express.js, React, Node.js) and many other tools in the JavaScript ecosystem to create responsive, accessible, and user-friendly web applications.

### Contact Me

- [GitHub](https://github.com/JBassard97)
- [Email Me](mailto:jonathanacciarito@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/jonathan-acciarito-46434b2aa/)
- [NPM](https://www.npmjs.com/~jbassard97)

