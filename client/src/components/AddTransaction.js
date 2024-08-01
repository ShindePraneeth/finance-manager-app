import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title,Select } from '../styles';

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
  const [category, setcategory] = useState('expense');
  const [date, setDate] = useState('');
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({ variables: { description, amount: parseFloat(amount), category, date } });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
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
       <Select value={category} onChange={(e) => setcategory(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </Select>
        <Input
          type="date"
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
