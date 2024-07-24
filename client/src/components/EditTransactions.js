import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title } from '../styles';

function EditTransaction() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/transactions/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      const transaction = response.data;
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setType(transaction.type || 'expense');
      setDate(transaction.date);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/transactions/${id}`, 
        { description, amount: parseFloat(amount), type: type.toLowerCase(), date },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <Container>
      <Title>Edit Transaction</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit">Update Transaction</Button>
      </Form>
    </Container>
  );
}

export default EditTransaction;
