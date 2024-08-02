import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title, Select } from '../styles';

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($description: String!, $amount: Float!, $category: String!, $date: String!) {
    addTransaction(description: $description, amount: $amount, category: $category, date: $date) {
      id
      description
      amount
      category
      date
    }
  }
`;

function AddTransaction() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Expense');
  const [date, setDate] = useState('');
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({ variables: { description, amount: parseFloat(amount), category, date } });
      window.alert('Transaction added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Title>Add Transaction</Title>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <Input
          type="text"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label htmlFor="amount">Amount</label>
        <Input
          type="number"
          id="amount"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <label htmlFor="category">Category</label>
        <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </Select>
        <label htmlFor="date">Date</label>
        <Input
          type="date"
          id="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit">Add Transaction</Button>
      </Form>
    </Container>
  );
}

export default AddTransaction;