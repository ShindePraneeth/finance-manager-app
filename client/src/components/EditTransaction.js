import React, { useState, useEffect } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Input, Button, Title,Select } from '../styles';

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
  const { loading, error, data } = useQuery(GET_TRANSACTION);
  const [editTransaction] = useMutation(EDIT_TRANSACTION);
  const navigate = useNavigate();
  const [category, setcategory] = useState('');
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    if (data) {
      const transactionData = data.getTransactions.find(t => t.id === id);
      setTransaction(transactionData);
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
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={transaction.description}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          value={transaction.amount}
          onChange={handleChange}
          required
        />
        <Select value={category} onChange={(e) => setcategory(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Input
          type="date"
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