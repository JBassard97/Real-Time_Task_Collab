# The order i did things in:

- created a github repo with an accurate name and project description

- initialized a React project with Vite and TypeScript. (npm create vite@latest my-app-name)

- removed boilerplate code and built and ran the Vite development server

- I also went into vite.config.ts as I've done in the past and added the following property to the server: { port: 3000, open: true }. This was done as port 3000 is just a personal preference, setting open to true allows the app to open in the browser when the Vite server starts up, which speeds development.

- researched how to implement websockets and tools like socket.io

- found and followed the socket.io docs to start creating a server

- copied their starter code, ran it locally with the node command, and was greeted with "User connected"

- I realized that I cannot run this server and vite at the same time in my terminal, so I installed the concurrency package (npm install concurrency --save-dev) to let me perform concurrent commands ("dev": "concurrently \"node server.cjs\" \"vite\"",)

- The documentation emphasized the power of custom events. I realized I could define events like addTask, completeTask, and deleteTask to handle task updates. The section on socket.on explained how to listen for events from the client, and io.emit demonstrated broadcasting updates to all connected clients. I experimented by emitting a simple message event, and when it worked flawlessly, I knew I could apply the same logic to my task management system.

I needed to store tasks in memory so the server could send the full list to any newly connected clients. The docs covered concepts like in-memory storage and data synchronization, which helped me implement the tasks array. I was amazed at how easily I could share the array's state with every user through the io.emit function.

With the server.cjs done it was time to connect it to the React Frontend

I discovered the Socket.IO Client library, specifically built for connecting to a WebSocket server. npm install socket.io-client

After that, I learned how to initialize a connection with io(). The example provided a simple way to establish a WebSocket connection, which I integrated into my React app. Using const socket = io("ws://localhost:3001");, my app successfully connected to the server.

"Client API" section of the docs explained how to listen for events from the server. I learned about the socket.on() method, which allowed me to receive real-time updates. For my app, I used this to listen for the "tasks" event, which sent the updated task list from the server. Using socket.on("tasks", (updatedTasks) => { setTasks(updatedTasks); });, I could see the tasks sync in real time whenever the server broadcasted changes.

socket.emit(), which let the client send custom events to the server. This was exactly what I needed for features like adding, completing, and deleting tasks. I implemented functions like addTask, where the client emitted the addTask event along with task data: socket.emit("addTask", task);

Finally, I integrated everything into my React app. The Socket.IO Client + React section suggested using useEffect to manage the WebSocket connection's lifecycle. I followed this approach, ensuring the client connected when the component mounted and cleaned up when it unmounted

I did some tenative inline styles within App.tsx's component




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
