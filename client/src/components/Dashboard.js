//finance-manager\client\src\components\Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { Container, Form, Input, Button, Title, LinkButton } from'../styles';
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
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/transactions/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const incomeTransactions = transactions.filter(t => 
    (t.type || t.category || '').toLowerCase() === 'income'
  );
  const expenseTransactions = transactions.filter(t => 
    (t.type || t.category || '').toLowerCase() === 'expense'
  );

  const TransactionList = ({ transactions, title }) => (
    <Container>
      <Title>{title}</Title>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - ${transaction.amount}- {transaction.date}
            <Button onClick={() => handleEdit(transaction.id)}>Edit</Button>
            <Button onClick={() => handleDelete(transaction.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </Container>
  );

  return (
    <Container>
      <Title>Dashboard</Title>
      <Button onClick={handleLogout}>Logout</Button>
      <LinkButton to="/add-transaction">Add Transaction</LinkButton>
      <TransactionList transactions={incomeTransactions} title="Income" />
      <TransactionList transactions={expenseTransactions} title="Expenses" />
    </Container>
  );
}

export default Dashboard;