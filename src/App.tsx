import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  creatorId: string;
}

const socket: Socket = io(
  process.env.NODE_ENV === "production"
    ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.hostname
      }:3001`
    : "ws://localhost:3001"
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [room, setRoom] = useState<string>(""); // Actual room name
  const [roomInput, setRoomInput] = useState<string>(""); // Input field value
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);

  useEffect(() => {
    socket.on("updateTasks", (updatedTasks: Task[]) => {
      setTasks(updatedTasks); // Update tasks when received
    });

    return () => {
      socket.off("updateTasks"); // Cleanup on unmount
    };
  }, []);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      setRoom(roomInput); // Update the actual room state
      socket.emit("joinRoom", roomInput);
      setHasJoinedRoom(true);
      setRoomInput(""); // Reset the input field's value
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
      socket.emit("addTask", { room, task });
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

      {/* Join Room Form */}
      <form onSubmit={joinRoom}>
        <h3>Join a Room</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)} // Update input value
            placeholder="Enter room name"
            required
          />
          <button type="submit">Go</button>
        </div>
      </form>

      {/* Only show tasks and task form after joining */}
      {hasJoinedRoom && (
        <div>
          <h2 style={{ width: "100%", textAlign: "center" }}>
            <span style={{ textDecoration: "underline" }}>Current Room:</span>
            <span style={{ textDecoration: "none" }}> "{room}"</span>
          </h2>

          {/* Add Task Form */}
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

          {/* Task List */}
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
                <div className="task-buttons" style={{ marginTop: "0.25rem" }}>
                  <button
                    className={
                      task.completed ? "undo-button" : "complete-button"
                    }
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
