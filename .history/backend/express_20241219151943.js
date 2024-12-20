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
      return res.status(400).json({ message: 'Please provide both old and new year.' });
    }
  
    try {
      // Find all records that match the old year in `effective_date`
      const itemsToUpdate = await User.find({
        effective_date: { $regex: oldYear }, // Match records containing the old year
      });
  
      if (itemsToUpdate.length === 0) {
        return res.status(404).json({ message: 'No records found with the given year.' });
      }
  
      // Update the `effective_date` for each record
      const updatedItems = itemsToUpdate.map((item) => {
        const updatedEffectiveDate = item.effective_date.replace(oldYear, newYear);
        return { ...item.toObject(), effective_date: updatedEffectiveDate }; // Create updated item
      });
  
      // Save the updated items back to the database
      const bulkOps = updatedItems.map((updatedItem) => ({
        updateOne: {
          filter: { _id: updatedItem._id },
          update: { $set: { effective_date: updatedItem.effective_date } },
        },
      }));
  
      // Execute bulk update
      const result = await FacilityItem.bulkWrite(bulkOps);
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          message: `${result.modifiedCount} records updated successfully.`,
        });
      } else {
        return res.status(404).json({ message: 'No records were updated.' });
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
