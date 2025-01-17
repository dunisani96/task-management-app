import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";

const Test = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          axiosInstance.get("/tasks"),
          axiosInstance.get("/users"),
        ]);

        console.log("Tasks Response:", tasksResponse.data);
        console.log("Users Response:", usersResponse.data);

        setTasks(tasksResponse.data.tasks || []); // Ensure tasks is an array
        setUsers(usersResponse.data.users || []); // Ensure users is an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching tasks or users.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.description}
          </li>
        ))}
      </ul>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstname} {user.lastname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;