import express from 'express';
import express from 'express';
import cors from 'cors';


const app = express();
const port = 5000;

// Middleware
app.use(json());

// Connect to MongoDB
connect('mongodb://127.0.0.1:27017/effective_date_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('Error connecting to MongoDB:', err));

// Define User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  effective_date: { type: String, required: true },
});

const User = model('User', userSchema);

// Routes
// Create a user
app.post('/users', async (req, res) => {
  try {
    const { username, effective_date } = req.body;

    if (!username || !effective_date) {
      return res.status(400).json({ message: 'Username and effective_date are required' });
    }

    const user = new User({ username, effective_date });
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
    const result = await User.updateMany(
      { effective_date: { $regex: oldYear } }, // Match effective_date containing oldYear
      { $set: { effective_date: { $replaceOne: { input: '$effective_date', find: oldYear, replacement: newYear } } } }
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
  console.log(`Server running at http://localhost:${port}`);
});
