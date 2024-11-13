import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users and organizations when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await axios.get('http://localhost/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming token is stored in localStorage
                    },
                });
                setUsers(usersResponse.data);

                // Fetch organizations
                const orgResponse = await axios.get('http://localhost/api/organisations', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming token is stored in localStorage
                    },
                });
                setOrganizations(orgResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred');
                setLoading(false);
            }
        };

        fetchData();
    }, []);  // Empty dependency array to fetch data only on component mount

    // Render loading or error state
    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error loading dashboard: {error}</div>;

    // Render dashboard content
    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>

            {/* Users Section */}
            <div className="dashboard-section">
                <h2>Users</h2>
                <p>Total Users: {users.length}</p>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.username} ({user.role})</li>
                    ))}
                </ul>
            </div>

            {/* Organizations Section */}
            <div className="dashboard-section">
                <h2>Organizations</h2>
                <p>Total Organizations: {organizations.length}</p>
                <ul>
                    {organizations.map(org => (
                        <li key={org.id}>{org.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
