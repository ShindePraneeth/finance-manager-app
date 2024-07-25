//finance-manager\server.mjs
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
    const token = jwt.sign({ id: user.id.toString(), username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Get transactions for a user
app.get('/transactions', verifyToken, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId.toString() === req.userId.toString());
  res.json(userTransactions);
});

// Add a new transaction
app.post('/transactions', verifyToken, async (req, res) => {
  const newTransaction = {
    id: (transactions.length + 1).toString(),
    userId: req.userId.toString(), // Ensure userId is a string
    description: req.body.description,
    amount: parseFloat(req.body.amount),
    type: (req.body.type || req.body.category || 'expense').toLowerCase(), // Normalize type/category
    date: req.body.date
  };
  transactions.push(newTransaction);
  try {
    await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
    res.json(newTransaction);
  } catch (error) {
    console.error('Error writing transaction data:', error);
    res.status(500).json({ message: 'Error saving transaction' });
  }
});
app.put('/transactions/:id', verifyToken, async (req, res) => {
  const transactionId = req.params.id;
  const index = transactions.findIndex(t => t.id === transactionId && t.userId === req.userId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found or not authorized' });
  }

  // Retain existing transaction details and only update fields that are provided
  const updatedTransaction = {
    ...transactions[index],
    ...req.body,
    type: req.body.type || transactions[index].type // Ensure type is not overwritten with an empty value
  };

  transactions[index] = updatedTransaction;

  try {
    await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error writing transaction data:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});


// Delete a transaction
app.delete('/transactions/:id', verifyToken, async (req, res) => {
  const transactionId = req.params.id;
  const index = transactions.findIndex(t => t.id === transactionId && t.userId === req.userId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found or not authorized' });
  }

  transactions.splice(index, 1);

  try {
    await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error writing transaction data:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});