import React, { useState } from 'react';
import '../styles/createOrganisation.css'
import axios from 'axios';

const CreateOrganization = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');  // Reset message before each submission

        try {
            // Send the organization name to the API
            const response = await axios.post('http://localhost/api/organisations', {
                name: name
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // JWT Token from localStorage
                }
            });

            setMessage(response.data.message);  // Set success or failure message
        } catch (error) {
            setMessage('Error creating organization');
            console.error(error);
        }
    };

    return (
        <div className="create-organization-container">
            <h2>Create New Organization</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Organization Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Organization</button>
            </form>
            {message && <p>{message}</p>}  {/* Display success or failure message */}
        </div>
    );
};

export default CreateOrganization;
