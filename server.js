const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');

// Define your GraphQL schema using ApolloServer
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Transaction {
    id: ID!
    userId: ID!
    description: String!
    amount: Float!
    category: String!
    date: String!
  }

  type Query {
    getTransactions: [Transaction]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    login(username: String!, password: String!): String
    addTransaction(description: String!, amount: Float!, category: String!, date: String!): Transaction
    editTransaction(id: ID!, description: String, amount: Float, category: String, date: String): Transaction
    deleteTransaction(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getTransactions: (parent, args, context) => {
      const { userId } = context;
      console.log(context)
      return transactions.filter(t => t.userId.toString() === userId.toString());
    },
  },
  Mutation: {
    register: async (parent,args) => {
      const { username, email, password } = args || {};

      console.log(username, password, email);
      if (!username || !email || !password) {
        throw new Error('Missing required fields');
      }
      if (users.find(u => u.username === username)) {
        throw new Error('Username already exists');
      }
      if (users.find(u => u.email === email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        id: users.length + 1,
        username,
        email,
        password
      };
      users.push(newUser);

      try {
        await fs.writeFile('user.json', JSON.stringify(users, null, 2));
        return 'User registered successfully';
      } catch (error) {
        console.error('Error writing user data:', error);
        throw new Error('Error registering user');
      }
    },
    login: (parent,args) => {

      const { username, password } = args || {};
      console.log(username,password);
      const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
      console.log(user);
      if (user) {
        const token = jwt.sign({ id: user.id.toString(), username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return token;
      } else {
        throw new Error('Invalid credentials');
      }
    },
    addTransaction: async (parent,{ description, amount, category, date }, context) => {
      const { userId } = context;
      const newTransaction = {
        id: (transactions.length + 1).toString(),
        userId: userId.toString(),
        description,
        amount: parseFloat(amount),
        category: category.toLowerCase(),
        date
      };
      transactions.push(newTransaction);

      try {
        await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
        return newTransaction;
      } catch (error) {
        console.error('Error writing transaction data:', error);
        throw new Error('Error saving transaction');
      }
    },
    editTransaction: async (parent,{ id, description, amount, category, date }, context) => {
      const { userId } = context;
      console.log(id,userId,description)
      const index = transactions.findIndex(t => t.id === id && t.userId === userId);

      if (index === -1) {
        throw new Error('Transaction not found or not authorized');
      }

      const updatedTransaction = {
        ...transactions[index],
        description: description || transactions[index].description,
        amount: amount !== undefined ? parseFloat(amount) : transactions[index].amount,
        category: category ? category.toLowerCase() : transactions[index].category,
        date: date || transactions[index].date
      };

      transactions[index] = updatedTransaction;

      try {
        await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
        return updatedTransaction;
      } catch (error) {
        console.error('Error writing transaction data:', error);
        throw new Error('Error updating transaction');
      }
    },
    deleteTransaction: async (parent,{ id }, context) => {
      const { userId } = context;
      const index = transactions.findIndex(t => t.id === id && t.userId === userId);

      if (index === -1) {
        throw new Error('Transaction not found or not authorized');
      }

      transactions.splice(index, 1);

      try {
        await fs.writeFile('transactions.json', JSON.stringify(transactions, null, 2));
        return 'Transaction deleted successfully';
      } catch (error) {
        console.error('Error writing transaction data:', error);
        throw new Error('Error deleting transaction');
      }
    }
  }
};

const SECRET_KEY = 'pfa';
let users = [];
let transactions = [];

const initializeData = async () => {
  try {
    const userData = await fs.readFile('user.json', 'utf8');
    users = JSON.parse(userData);
  } catch (error) {
    console.error('Error reading user data:', error);
  }

  try {
    const transactionData = await fs.readFile('transactions.json', 'utf8');
    transactions = JSON.parse(transactionData);
  } catch (error) {
    console.error('Error reading transaction data:', error);
  }
};

initializeData();

const getUserFromToken = (token) => {
  try {
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, SECRET_KEY);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const userId = getUserFromToken(token);
    return { userId };
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// Start the Apollo Server and apply middleware to Express
const startServer = async () => {
  await server.start(); // Wait for the Apollo server to start
  server.applyMiddleware({ app }); // Apply middleware to Express

  // Start the Express server
  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();