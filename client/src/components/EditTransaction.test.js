import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditTransaction, { GET_TRANSACTION, EDIT_TRANSACTION } from './EditTransaction';
 
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
      query: GET_TRANSACTION,
      variables: { id: '1' },
    },
    result: {
      data: {
        getTransactions: [
          {
            id: '1',
            description: 'Test description',
            amount: 100,
            category: 'income',
            date: '2024-07-30',
          },
        ],
      },
    },
  },
  {
    request: {
      query: EDIT_TRANSACTION,
      variables: {
        id: '1',
        description: 'Updated description',
        amount: 200,
        category: 'expense',
        date: '2024-08-01',
      },
    },
    result: {
      data: {
        editTransaction: {
          id: '1',
          description: 'Updated description',
          amount: 200,
          category: 'expense',
          date: '2024-08-01',
        },
      },
    },
  },
];
 
describe('EditTransaction Component', () => {
  it('renders without crashing and loads data', async () => {
    render(
<MockedProvider mocks={mocks} addTypename={false}>
<MemoryRouter initialEntries={['/edit-transaction/1']}>
<Routes>
<Route path="/edit-transaction/:id" element={<EditTransaction />} />
</Routes>
</MemoryRouter>
</MockedProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Description')).toHaveValue('Test description');
      expect(screen.getByPlaceholderText('Amount')).toHaveValue(100);
      expect(screen.getByPlaceholderText('Date')).toHaveValue('2024-07-30');
    });
  });
 
  it('allows the user to edit the transaction', async () => {
    render(
<MockedProvider mocks={mocks} addTypename={false}>
<MemoryRouter initialEntries={['/edit-transaction/1']}>
<Routes>
<Route path="/edit-transaction/:id" element={<EditTransaction />} />
</Routes>
</MemoryRouter>
</MockedProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Description')).toHaveValue('Test description');
    });
 
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Updated description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: 200 },
    });
    fireEvent.change(screen.getByPlaceholderText('Date'), {
      target: { value: '2024-08-01' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: 'expense' },
    });
 
    expect(screen.getByPlaceholderText('Description')).toHaveValue('Updated description');
    expect(screen.getByPlaceholderText('Amount')).toHaveValue(200);
    expect(screen.getByPlaceholderText('Date')).toHaveValue('2024-08-01');
    expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('expense');
 
    fireEvent.click(screen.getByRole('button', { name: /edit transaction/i }));
 
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Transaction edited successfully!');
    });
  });
});