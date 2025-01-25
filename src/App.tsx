import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const socket: Socket = io("ws://localhost:3001");

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    // Listen for task updates from the server
    socket.on("tasks", (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasks");
    };
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = { id: Date.now(), text: newTask, completed: false };
      socket.emit("addTask", task);
      setNewTask("");
    }
  };

  const toggleComplete = (id: number) => {
    socket.emit("completeTask", id);
  };

  const deleteTask = (id: number) => {
    socket.emit("deleteTask", id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Real-Time Task Collaboration
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px",
            width: "300px",
          }}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6c757d" : "#000",
              }}
            >
              {task.text}
            </span>
            <div>
              <button
                style={{
                  padding: "6px 10px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => toggleComplete(task.id)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                style={{
                  padding: "6px 10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
