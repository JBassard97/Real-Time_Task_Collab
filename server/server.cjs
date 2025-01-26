const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Serve static files from the 'client/dist' folder in production
  if (process.env.NODE_ENV === "production") {
    const filePath = path.join(
      __dirname,
      "../client/dist",
      req.url === "/" ? "/index.html" : req.url
    );
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running in development mode");
  }
});

// Set up WebSocket server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for security in production
  },
});

const roomTasks = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    if (!roomTasks[room]) {
      roomTasks[room] = []; // Initialize the room's task list if it doesn't exist
    }
    socket.emit("tasks", roomTasks[room]); // Send current tasks to the user
  });

  // Handle task creation
  socket.on("createTask", (task) => {
    const {
      room,
      task: { text, creatorId, completed },
    } = task;

    roomTasks[room] = roomTasks[room] || [];
    const newTask = {
      id: Date.now(), // Assign a unique ID based on the timestamp
      text,
      creatorId,
      completed,
    };

    roomTasks[room].push(newTask);
    io.to(room).emit("tasks", roomTasks[room]);
  });

  // Handle task completion (toggle between complete and incomplete)
  socket.on("completeTask", (task) => {
    const { room, id } = task;
    const taskIndex = roomTasks[room].findIndex((t) => t.id === id);

    if (taskIndex !== -1) {
      roomTasks[room][taskIndex].completed =
        !roomTasks[room][taskIndex].completed; // Toggle completion status
      io.to(room).emit("tasks", roomTasks[room]);
    }
  });

  // Handle task deletion
  socket.on("deleteTask", (task) => {
    const { room, id } = task;
    const taskIndex = roomTasks[room].findIndex((t) => t.id === id);

    if (taskIndex !== -1) {
      roomTasks[room].splice(taskIndex, 1); // Remove task from the list
      io.to(room).emit("tasks", roomTasks[room]); // Emit updated tasks
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Listen for incoming connections
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
