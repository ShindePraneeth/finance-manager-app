import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Dashboard, { GET_TRANSACTIONS, DELETE_TRANSACTION } from './Dashboard';

// Mock data for transactions
const mockTransactions = [
  {
    id: '1',
    description: 'Salary',
    amount: 5000,
    category: 'income',
    date: '2023-01-15',
  },
  {
    id: '2',
    description: 'Groceries',
    amount: 200,
    category: 'expense',
    date: '2023-01-20',
  },
];


beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    window.confirm = jest.fn(() => true); // Mock window.confirm to always return true
  });
  
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks(); // Restore all mocked functions
  });

// Mocks for the GraphQL queries and mutations
const mocks = [
  {
    request: {
      query: GET_TRANSACTIONS,
    },
    result: {
      data: {
        getTransactions: mockTransactions,
      },
    },
  },
  {
    request: {
      query: DELETE_TRANSACTION,
      variables: { id: '2' },
    },
    result: {
      data: {
        deleteTransaction: 'Transaction deleted successfully',
      },
    },
  },
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders Dashboard and displays transactions', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the transactions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Check that the income and expense totals are displayed correctly
    expect(screen.getByText('Total Income: $5000.00')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses: $200.00')).toBeInTheDocument();
    expect(screen.getByText('Final Balance: $4800.00')).toBeInTheDocument();
  });

  test('filters transactions by month and year', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the transactions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Filter by year
    fireEvent.change(screen.getByLabelText('Filter by Year:'), {
      target: { value: '2023' },
    });

    // Filter by month (January)
    fireEvent.change(screen.getByLabelText('Filter by Month:'), {
      target: { value: '0' },
    });

    // Check that the filtered transactions are displayed correctly
    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });
  });

  test('deletes a transaction', async () => {
    const mocks = [
      {
        request: { query: GET_TRANSACTIONS },
        result: { data: { getTransactions: mockTransactions } },
      },
      {
        request: { query: DELETE_TRANSACTION, variables: { id: '2' } },
        result: { data: { deleteTransaction: 'Transaction deleted successfully' } },
      },
    ];
  
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </MockedProvider>
    );
  
    // Wait for the component to render
    await waitFor(() => {
      screen.debug(); // This will log the rendered content
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  
    // Try to find the 'Groceries' transaction
    const groceriesTransaction = screen.queryByText('Groceries');
    if (groceriesTransaction) {
      console.log("Found 'Groceries' transaction");
    } else {
      console.log("'Groceries' transaction not found");
      // Log all the text content in the document
      console.log("All text content:", screen.getByRole('document').textContent);
    }
  
    // Rest of the test...
  });

  test('logs out the user', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the transactions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Click the logout button
    fireEvent.click(screen.getByTestId('logout-button'));

    // Check that the token is removed from localStorage
    expect(localStorage.getItem('token')).toBeNull();
  });
});
