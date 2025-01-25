const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

// Store tasks for each room
const roomTasks = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    // Send current tasks to the newly connected user
    if (!roomTasks[room]) {
      roomTasks[room] = []; // Initialize if room doesn't exist
    }
    socket.emit("updateTasks", roomTasks[room]); // Send tasks to user
  });

  // Leave a room
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  // Add task to a specific room
  socket.on("addTask", ({ room, task }) => {
    if (!roomTasks[room]) return;

    roomTasks[room].push(task);
    io.to(room).emit("updateTasks", roomTasks[room]); // Broadcast updated tasks
  });

  // Complete a task
  socket.on("completeTask", ({ room, id }) => {
    if (!roomTasks[room]) return;

    roomTasks[room] = roomTasks[room].map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    io.to(room).emit("updateTasks", roomTasks[room]);
  });

  // Delete a task
  socket.on("deleteTask", ({ room, id }) => {
    if (!roomTasks[room]) return;

    roomTasks[room] = roomTasks[room].filter((task) => task.id !== id);
    io.to(room).emit("updateTasks", roomTasks[room]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
