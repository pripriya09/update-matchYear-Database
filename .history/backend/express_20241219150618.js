import express from "express"
import mongoose, { Schema } from 'mongoose'; 
import cors from "cors"

const app = express();
const port = 8000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", ]
  })
);


mongoose.connect("mongodb://localhost:27017/effective-date")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  effective_date: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/users', async (req, res) => {
    try {
      const { username, effective_date } = req.body;
  
      if (!username || !effective_date) {
        return res.status(400).json({ message: 'Username and effective_date are required' });
      }
  
      // Convert the effective_date to the format DD/MM/YYYY
      const formattedDate = new Date(effective_date).toLocaleDateString('en-GB'); // 'en-GB' ensures the format is DD/MM/YYYY
  
      const user = new User({ username, effective_date: formattedDate });
      await user.save();
      res.status(201).json({ message: 'User created', user });
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  });
  
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Update effective_date for a specific year
app.post('/update-year', async (req, res) => {
    const { oldYear, newYear } = req.body;
  
    if (!oldYear || !newYear) {
      return res.status(400).json({ message: 'Both oldYear and newYear are required' });
    }
  
    try {
      // Update all users whose effective_date contains the oldYear
      const result = await User.updateMany(
        { effective_date: { $regex: oldYear } }, // Match effective_date containing oldYear
        [
          {
            $set: {
              effective_date: {
                $concat: [
                  { $arrayElemAt: [{ $split: ["$effective_date", "/"] }, 0] }, // Extract the day
                  "/",
                  { $arrayElemAt: [{ $split: ["$effective_date", "/"] }, 1] }, // Extract the month
                  "/",
                  newYear // Replace with the new year
                ]
              }
            }
          }
        ]
      );
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: 'Effective dates updated successfully.', result });
      } else {
        return res.status(404).json({ message: 'No records found with the given year.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while updating the year.' });
    }
  });
    
// Start the server
app.listen(port, () => {
  console.log("Server connected",port);
});
