import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import "../styles/Dashboard.css"; // Import the updated CSS

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null); // To track the dragged task
  const [user, setUser] = useState(null); // To track the logged-in user

  // Fetch tasks and users from the API on component mount
  useEffect(() => {

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
      try {
        // Fetch user session info from the server
        const userResponse = await axiosInstance.get(`/users/${savedUser.id}`, { withCredentials: true });
        
        if (userResponse.data.success) {
          setUser(userResponse.data.user);
          console.log(userResponse.data.user) // Set the user in state

          // Fetch tasks assigned to the current user by sending their ID in the query params
          const tasksResponse = await axiosInstance.get(`/tasks/${userResponse.data.user.id}`, { withCredentials: true });
          console.log("Tasks Response:", tasksResponse.data);

          if (tasksResponse.data.success) {
            setTasks(tasksResponse.data.tasks); // Set tasks in state
          } else {
            setError(tasksResponse.data.message || "Failed to fetch tasks.");
          }

          setLoading(false); // Stop loading after both requests
        } else {
          setError("User not found. Please log in.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching tasks or users.");
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, []);

  // Drag handlers (same as before)
  const handleDragStart = (task) => {
    setDraggedTask(task); // Set the task being dragged
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow the drop by preventing the default behavior
  };

  const handleDrop = async (status) => {
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, status };

    // Update task status in the database
    try {
      await axiosInstance.put(`/tasks/${draggedTask.id}`, {
        status: status,
      }, { withCredentials: true });

      // Update task status in the frontend state
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
    } catch (err) {
      setError("Failed to update task status.");
    }

    setDraggedTask(null); // Clear the dragged task after drop
  };

  

  // Categorize tasks based on their status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  // Render loading or error state
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Task Board</h1>
      {user && <h2>Welcome, {user.firstname} {user.lastname}</h2>}
      <div className="task-board">
        {/* Todo Column */}
        <div
          className="task-column todo"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("todo")}
        >
          <h2>Todo</h2>
          {todoTasks.length > 0 ? (
            <ul>
              {todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  handleDragStart={() => handleDragStart(task)}
                />
              ))}
            </ul>
          ) : (
            <p>No tasks in todo</p>
          )}
        </div>

        {/* In Progress Column */}
        <div
          className="task-column in-progress"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("in_progress")}
        >
          <h2>In Progress</h2>
          {inProgressTasks.length > 0 ? (
            <ul>
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  handleDragStart={() => handleDragStart(task)}
                />
              ))}
            </ul>
          ) : (
            <p>No tasks in progress</p>
          )}
        </div>

        {/* Done Column */}
        <div
          className="task-column done"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("done")}
        >
          <h2>Done</h2>
          {doneTasks.length > 0 ? (
            <ul>
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  handleDragStart={() => handleDragStart(task)}
                
                />
              ))}
            </ul>
          ) : (
            <p>No tasks completed</p>
          )}
        </div>
      </div>
    </div>
  );
};

// TaskCard Component to display each task with a dropdown to assign a user
const TaskCard = ({ task, users, handleDragStart, handleUserAssign }) => {
  return (
    <li className="task-item" draggable onDragStart={handleDragStart}>
      <p>{task.title}</p>
      <small className="mb-5">{task.description}</small>

      <label htmlFor={`assign-user-${task.id}`}>
        <b>Assign User:</b>
      </label>
      
    </li>
  );
};

export default Dashboard;
