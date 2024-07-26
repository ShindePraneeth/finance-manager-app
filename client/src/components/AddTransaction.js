//finance-manager\client\src\components\AddTransaction.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title, Select } from'../styles'
function AddTransaction() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(''); // Add state for date

  const [type, setType] = useState('expense');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/transactions', 
        { 
          description, 
          amount: parseFloat(amount), 
          type: type.toLowerCase(), 
          date: date 
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding transaction:', error);
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };
  
  return (
    <Container>
      <Title>Add Transaction</Title>
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
        <Input
        type="date"
        placeholder='yyyy-mm-dd'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </Select>
        <Button type="submit">Add Transaction</Button>
      </Form>
    </Container>
  );
}

export default AddTransaction;