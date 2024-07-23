import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

// Read user data
let users;
try {
  const userData = await fs.readFile('user.json', 'utf8');
  users = JSON.parse(userData);
} catch (error) {
  console.error('Error reading user data:', error);
  users = [];
}
// Read transactions data
let transactions;
try {
  const transactionData = await fs.readFile('transactions.json', 'utf8');
  transactions = JSON.parse(transactionData);
} catch (error) {
  console.error('Error reading transaction data:', error);
  transactions = [];
}
// Registration route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if username or email already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password // In a real app, you should hash this password
  };
  users.push(newUser);

  try {
    await fs.writeFile('user.json', JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error writing user data:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ... (keep other existing routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});