const { Server } = require("./client/node_modules/socket.io/dist");

const port = process.env.PORT || 3001;
const io = new Server(port, {
  cors: {
    origin: "*",
  },
});

// Tasks for each room
const roomTasks = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    // Send the current tasks for the room to the newly connected client
    if (!roomTasks[room]) {
      roomTasks[room] = []; // Initialize the room's task list if it doesn't exist
    }
    socket.emit("tasks", roomTasks[room]);
  });

  // Add task to a specific room
  socket.on("addTask", ({ room, task }) => {
    if (!roomTasks[room]) return;

    roomTasks[room].push(task);
    io.to(room).emit("tasks", roomTasks[room]); // Broadcast updated tasks to the room
  });

  // Complete a task in a specific room
  socket.on("completeTask", ({ room, id }) => {
    if (!roomTasks[room]) return;

    roomTasks[room] = roomTasks[room].map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    io.to(room).emit("tasks", roomTasks[room]);
  });

  // Delete a task in a specific room
  socket.on("deleteTask", ({ room, id }) => {
    if (!roomTasks[room]) return;

    roomTasks[room] = roomTasks[room].filter((task) => task.id !== id);
    io.to(room).emit("tasks", roomTasks[room]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

console.log("WebSocket server running on ws://localhost:3001");
