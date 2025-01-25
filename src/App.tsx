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
  const [room, setRoom] = useState<string>("");

  useEffect(() => {
    // Listen for task updates from the server
    socket.on("tasks", (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasks");
    };
  }, []);

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("joinRoom", room);
    }
  };

  const addTask = () => {
    if (newTask.trim() && room) {
      const task: Task = { id: Date.now(), text: newTask, completed: false };
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time Task Collaboration</h1>
      <div>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => toggleComplete(task.id)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
