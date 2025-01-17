import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskList.css"; // Add your CSS file for styling

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null); // Holds task being edited
  const [showModal, setShowModal] = useState(false); // To show/hide the create modal
  const [newTask, setNewTask] = useState({ title: "", description: "" }); // New task form state

  // Fetch tasks on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.success)
          setTasks(response.data.tasks);
          console.log(response.data.tasks)
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch tasks");
        setLoading(false);
      });
  }, []);

  // Handle input change for new task form  §
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle task creation
  const handleCreateTask = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/tasks", newTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setTasks([...tasks, response.data.task]); // Add new task to the list
          setNewTask({ title: "", description: "" }); // Reset form
          setShowModal(false); // Close modal after successful creation
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to create task");
      });
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (task) => {
    axios
      .put(`http://localhost:8000/api/tasks/${task.id}`, task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          const updatedTasks = tasks.map((t) =>
            t.id === task.id ? { ...task, ...response.data.task } : t
          );
          setTasks(updatedTasks);
          setEditingTask(null); // Close edit form
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to update task");
      });
  };

  // Handle task deletion
  const handleDeleteTask = (id) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          setTasks(updatedTasks);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to delete task");
      });
  };

  // Function to apply color based on task status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "status-todo";
      case "in_progress":
        return "status-in-progress";
      case "done":
        return "status-done";
      default:
        return "";
    }
  };

  // Render loading or error state
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Task List</h1>

      {/* Button to Open Modal */}
      <button className="create-btn" onClick={() => setShowModal(true)}>
        Create Task
      </button>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task title"
                required
              />
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task description"
                required
              />
              <button type="submit">Create Task</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task List Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {editingTask && editingTask.id === task.id ? (
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {editingTask && editingTask.id === task.id ? (
                  <input
                    type="text"
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  task.description
                )}
              </td>
              <td className={getStatusColor(task.status)}>
                {task.status.toUpperCase().replace("_", " ")}
              </td>{" "}
              {/* Status with color */}
              <td>
                {editingTask && editingTask.id === task.id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => handleUpdateTask(editingTask)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingTask(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
