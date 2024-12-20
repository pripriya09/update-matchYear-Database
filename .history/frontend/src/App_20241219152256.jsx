import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [oldYear, setOldYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]); // State to store users

  const baseURL = "http://localhost:8000"; // Backend URL

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/users`);
        setUsers(response.data); // Store users in state
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means it runs once when the component mounts

  // Add User
  const handleAddUser = async () => {
    if (!username || !effectiveDate) {
      setMessage("Please provide both username and effective date.");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/users`, {
        username,
        effective_date: effectiveDate,
      });

      if (response.status === 201) {
        setMessage("User added successfully!");
        setUsername("");
        setEffectiveDate("");
        // Optionally re-fetch the users after adding one
        const updatedUsers = await axios.get(`${baseURL}/users`);
        setUsers(updatedUsers.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("An error occurred while adding the user.");
    }
  };

  // Update Year
  const handleUpdateYear = async () => {
    if (!oldYear || !newYear) {
      setMessage("Please provide both old year and new year.");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/update-year`, {
        oldYear,
        newYear,
      });

      if (response.status === 200) {
        setMessage("Year updated successfully!");
        setOldYear("");
        setNewYear("");
      }
    } catch (error) {
      console.error("Error updating year:", error);
      setMessage("An error occurred while updating the year.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Effective Date Manager</h1>

      {/* Add User */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Update Year */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Update Effective Date Year</h2>
        <input
          type="text"
          placeholder="Old Year "
          value={oldYear}
          onChange={(e) => setOldYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="update year"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleUpdateYear}>Update Year</button>
      </div>

      {/* Display Users */}
      {/* <div style={{ marginTop: "30px" }}>
        <h2>Users List</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id}>
                <strong>{user.username}</strong> - {user.effective_date}
              </li>
            ))
          ) : (
            <p>No users found</p>
          )}
        </ul>
      </div> */}

      {/* Message */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default App;
