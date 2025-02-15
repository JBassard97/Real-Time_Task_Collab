import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  creatorId: string;
}

// Socket connection logic
const socket: Socket = io(
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:3001",
  {
    transports: ["websocket"], // Ensure WebSocket is used
  }
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomInput, setRoomInput] = useState<string>("");
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected to Websocket: ${socket.id}`);
    });

    socket.on("tasks", (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("connect");
      socket.off("tasks");
    };
  }, []);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      setRoom(roomInput);
      socket.emit("joinRoom", roomInput);
      setHasJoinedRoom(true);
      setRoomInput("");
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() && room) {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        creatorId: socket.id || "",
      };
      socket.emit("createTask", { room, task });
      setNewTask("");
    }
  };

  const toggleComplete = (id: number) => {
    if (room) {
      socket.emit("completeTask", { room, id });
    }
  };

  const deleteTask = (id: number) => {
    if (room) {
      socket.emit("deleteTask", { room, id });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h1>Real-Time Task Collab</h1>

      <form onSubmit={joinRoom} style={{ marginBottom: "2rem" }}>
        <h3>Join a Room</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room name"
            required
          />
          <button type="submit">Go</button>
        </div>
      </form>

      {hasJoinedRoom && (
        <div>
          <h2 style={{ width: "100%", textAlign: "center" }}>
            <span style={{ textDecoration: "underline" }}>Current Room:</span>
            <span style={{ textDecoration: "none" }}> "{room}"</span>
          </h2>

          <form onSubmit={addTask} style={{ marginBottom: "1rem" }}>
            <h3>Add a Task</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                required
              />
              <button type="submit">Add Task</button>
            </div>
          </form>

          <ul style={{ listStyle: "none" }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: "0.5rem" }}>
                <div>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "lightgreen" : "white",
                    }}
                  >
                    {task.text}
                  </span>
                  <div>
                    <span
                      style={{
                        fontStyle: "italic",
                        color: task.completed ? "green" : "#777",
                      }}
                    >
                      Task Created By: {task.creatorId}
                    </span>
                  </div>
                </div>
                <button
                  className={task.completed ? "undo-button" : "complete-button"}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
