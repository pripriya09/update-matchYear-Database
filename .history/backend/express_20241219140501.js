import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [oldYear, setOldYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [message, setMessage] = useState("");

  // Add User
  const handleAddUser = async () => {
    if (!username || !effectiveDate) {
      setMessage("Please provide both username and effective date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/users", {
        username,
        effective_date: effectiveDate,
      });

      setMessage(response.data.message || "User added successfully!");
      setUsername("");
      setEffectiveDate("");
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
      const response = await axios.post("http://localhost:8000/update-year", {
        oldYear,
        newYear,
      });

      setMessage(response.data.message || "Year updated successfully!");
      setOldYear("");
      setNewYear("");
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
          placeholder="Old Year"
          value={oldYear}
          onChange={(e) => setOldYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="New Year"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleUpdateYear}>Update Year</button>
      </div>

      {/* Message */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default App;
npm run devicePixelRati