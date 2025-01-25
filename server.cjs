const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

let tasks = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current tasks to the connected client
  socket.emit("tasks", tasks);

  // Handle adding a task
  socket.on("addTask", (task) => {
    tasks.push(task);
    io.emit("tasks", tasks); // Broadcast updated tasks
  });

  // Handle completing a task
  socket.on("completeTask", (id) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    io.emit("tasks", tasks);
  });

  // Handle deleting a task
  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    io.emit("tasks", tasks);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("WebSocket server running on ws://localhost:3001");
