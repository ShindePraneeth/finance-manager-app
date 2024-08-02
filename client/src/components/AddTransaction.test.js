import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import AddTransaction, { ADD_TRANSACTION } from './AddTransaction';
 
// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
 
// Mock window.alert
global.alert = jest.fn();
 
const mocks = [
  {
    request: {
      query: ADD_TRANSACTION,
      variables: {
        description: 'Test description',
        amount: 100,
        category: 'Expense',
        date: '2024-07-30',
      },
    },
    result: {
      data: {
        addTransaction: {
          id: '1',
          description: 'Test description',
          amount: 100,
          category: 'Expense',
          date: '2024-07-30',
        },
      },
    },
  },
];
 
describe('AddTransaction Component', () => {
  it('renders without crashing', () => {
    render(
<MockedProvider mocks={[]} addTypename={false}>
<MemoryRouter>
<AddTransaction />
</MemoryRouter>
</MockedProvider>
    );
    expect(screen.getByRole('heading', { name: /add transaction/i })).toBeInTheDocument();
  });
 
  it('allows the user to fill out the form', () => {
    render(
<MockedProvider mocks={[]} addTypename={false}>
<MemoryRouter>
<AddTransaction />
</MemoryRouter>
</MockedProvider>
    );
 
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText('Date'), {
      target: { value: '2024-07-30' },
    });
 
    expect(screen.getByPlaceholderText('Description')).toHaveValue('Test description');
    expect(screen.getByPlaceholderText('Amount')).toHaveValue(100);
    expect(screen.getByPlaceholderText('Date')).toHaveValue('2024-07-30');
  });
 
  it('submits the form and shows success message', async () => {
    render(
<MockedProvider mocks={mocks} addTypename={false}>
<MemoryRouter>
<AddTransaction />
</MemoryRouter>
</MockedProvider>
    );
 
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText('Date'), {
      target: { value: '2024-07-30' },
    });
 
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
 
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Transaction added successfully!');
    });
  });
 
  it('handles error on form submission', async () => {
    const errorMocks = [
      {
        request: {
          query: ADD_TRANSACTION,
          variables: {
            description: 'Test description',
            amount: 100,
            category: 'Expense',
            date: '2024-07-30',
          },
        },
        error: new Error('An error occurred'),
      },
    ];
 
    console.error = jest.fn();
 
    render(
<MockedProvider mocks={errorMocks} addTypename={false}>
<MemoryRouter>
<AddTransaction />
</MemoryRouter>
</MockedProvider>
    );
 
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText('Date'), {
      target: { value: '2024-07-30' },
    });
 
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
 
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});