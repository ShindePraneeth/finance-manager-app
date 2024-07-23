import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/transactions', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/add-transaction">Add Transaction</Link>
      <h3>Transactions</h3>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - ${transaction.amount} ({transaction.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;