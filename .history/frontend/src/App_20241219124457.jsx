import React, { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [oldYear, setOldYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [message, setMessage] = useState("");

  const baseURL = "http://localhost:8000"; 

  // Add User
  const handleAddUser = async () => {
    if (!username || !effectiveDate) {
      setMessage("Please provide both username and effective date.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, effective_date: effectiveDate }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("User added successfully!");
        setUsername("");
        setEffectiveDate("");
      } else {
        setMessage(data.message || "Failed to add user.");
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
      const response = await fetch(`${baseURL}/update-year`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldYear, newYear }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Year updated successfully!");
        setOldYear("");
        setNewYear("");
      } else {
        setMessage(data.message || "Failed to update year.");
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
          placeholder="year"
          value={oldYear}
          onChange={(e) => setOldYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="New Year (e.g., 2025)"
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
