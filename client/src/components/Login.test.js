import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import Login, { LOGIN_USER } from './Login';

const mocks = [
  {
    request: {
      query: LOGIN_USER,
      variables: { username: 'testuser', password: 'password' },
    },
    result: {
      data: {
        login: 'fakeToken',
      },
    },
  },
];

test('renders login form', () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <Router>
        <Login />
      </Router>
    </MockedProvider>
  );

  expect(screen.getByText(/Personal Finance Management/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Username or Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
  expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test('login success', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Router>
        <Login />
      </Router>
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Username or Email/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

  fireEvent.click(screen.getByRole('button', { name: /Login/i }));

  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fakeToken');
  });
});

test('login error', async () => {
  const errorMocks = [
    {
      request: {
        query: LOGIN_USER,
        variables: { username: 'wronguser', password: 'wrongpassword' },
      },
      error: new Error('Invalid username or password'),
    },
  ];

  render(
    <MockedProvider mocks={errorMocks} addTypename={false}>
      <Router>
        <Login />
      </Router>
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Username or Email/i), { target: { value: 'wronguser' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });

  fireEvent.click(screen.getByRole('button', { name: /Login/i }));

  await waitFor(() => {
    expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
  });
});