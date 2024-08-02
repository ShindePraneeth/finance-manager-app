import React, { useState, useEffect } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Input, Button, Title, Select } from '../styles';

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    getTransactions {
      id
      description
      amount
      category
      date
    }
  }
`;

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($id: ID!, $description: String, $amount: Float, $category: String, $date: String) {
    editTransaction(id: $id, description: $description, amount: $amount, category: $category, date: $date) {
      id
      description
      amount
      category
      date
    }
  }
`;

function EditTransaction() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_TRANSACTION, { variables: { id } });
  const [editTransaction] = useMutation(EDIT_TRANSACTION);
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    if (data) {
      const transactionData = data.getTransactions.find(t => t.id === id);
      if (transactionData) {
        setTransaction(transactionData);
      }
    }
  }, [data, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTransaction({
        variables: {
          id,
          description: transaction.description,
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          date: transaction.date
        }
      });
      window.alert('Transaction edited successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Title>Edit Transaction</Title>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <Input
          type="text"
          id="description"
          name="description"
          placeholder="Description"
          value={transaction.description}
          onChange={handleChange}
          required
        />
        <label htmlFor="amount">Amount</label>
        <Input
          type="number"
          id="amount"
          name="amount"
          placeholder="Amount"
          value={transaction.amount}
          onChange={handleChange}
          required
        />
        <label htmlFor="category">Category</label>
        <Select
          id="category"
          name="category"
          value={transaction.category}
          onChange={handleChange}
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <label htmlFor="date">Date</label>
        <Input
          type="date"
          id="date"
          name="date"
          placeholder="Date"
          value={transaction.date}
          onChange={handleChange}
          required
        />
        <Button type="submit">Edit Transaction</Button>
      </Form>
    </Container>
  );
}

export default EditTransaction;
