import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserManagement.css"; // Add your CSS file for styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // Holds user being edited
  const [showModal, setShowModal] = useState(false); // To show/hide the create modal
  const [newUser, setNewUser] = useState({ firstname: "",lastname:"",phone:"", email: "", role: "" }); // New user form state
  const [userRole, setUserRole] = useState(null); // Holds user role

  // Fetch users and user role on component mount
  useEffect(() => {
    // Fetch the user's role from localStorage when the component mounts
    const storedUser = JSON.parse(localStorage.getItem("user")); // Parse the stored JSON string
    if (storedUser && storedUser.role) {
      setUserRole(storedUser.role); // Set the user role from localStorage
    } else {
      setError("Failed to fetch user role from localStorage");
    }

    // Fetch users (admin only)
    if (storedUser && storedUser.role === "admin") {
      axios
        .get("http://localhost:8000/api/users", { withCredentials: true })
        .then((response) => {
          if (response.data.success) {
            setUsers(response.data.users);
          } else {
            setError(response.data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch users");
          setLoading(false);
        });
    }
  }, []);

  // Handle input change for new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle user creation
  const handleCreateUser = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/users", newUser, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setUsers([...users, response.data.user]); // Add new user to the list
          setNewUser({ firstname: "",lastname:"",phone:"",occupation:"", email: "", role: "" }); // Reset form
          setShowModal(false); // Close modal after successful creation
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to create user");
      });
  };

  // Handle user editing
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (user) => {
    axios
      .put(`http://localhost:8000/api/users/${user.id}`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const updatedUsers = users.map((u) =>
            u.id === user.id ? { ...user, ...response.data.user } : u
          );
          setUsers(updatedUsers);
          console.log("User updated successfully");
          setEditingUser(null); // Close edit form
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to update user");
      });
  };

  // Handle user deletion
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:8000/api/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to delete user");
      });
  };

  // Check if the user is an admin
  const isAdmin = userRole === "admin";

  // Render loading or error state
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* Button to Open Modal */}
      {isAdmin && (
        <button className="create-btn" onClick={() => setShowModal(true)}>
          Create User
        </button>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="text"
                name="firstname"
                value={newUser.firstname}
                onChange={handleInputChange}
                placeholder="firstname"
                required
              />
               <input
                type="text"
                name="lastname"
                value={newUser.lastname}
                onChange={handleInputChange}
                placeholder="lastname"
                required
              />
               <input
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
                placeholder="phone number"
                required
              />
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Create User</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User List Table */}
      <table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>last name</th>
            <th>Phone Number</th>
            <th>Occupation</th>
            <th>Email</th>
            <th>Role</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.firstname}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, firstname: e.target.value })
                    }
                  />
                ) : (
                  user.firstname
                )}
              </td>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.lastname}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, lastname: e.target.value })
                    }
                  />
                ) : (
                  user.lastname
                )}
              </td>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                  />
                ) : (
                  user.phone
                )}
              </td>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.occupation}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, occupation: e.target.value })
                    }
                  />
                ) : (
                  user.occupation
                )}
              </td>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUser && editingUser.id === user.id ? (
                  <select
                    type="text"
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              
              {isAdmin && (
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <button
                        className="save-btn"
                    onClick={() => {handleUpdateUser(editingUser)
                            console.log("User updated successfully");
                    }
                        }
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
