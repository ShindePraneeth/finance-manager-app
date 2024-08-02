import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Register, { REGISTER_USER } from './Register';

const mocks = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      },
    },
    result: {
      data: {
        register: 'User registered successfully',
      },
    },
  },
];

describe('Register Component', () => {
  test('renders register form', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('registers a user successfully', async () => {
    window.alert = jest.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Registered successfully! Redirecting to Login!'));
  });

  test('shows error when username already exists', async () => {
    const errorMocks = [
      {
        request: {
          query: REGISTER_USER,
          variables: {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
          },
        },
        error: new Error('username already exists'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => expect(screen.getByText(/Username already exists/i)).toBeInTheDocument());
  });

  test('shows error when registration fails', async () => {
    const errorMocks = [
      {
        request: {
          query: REGISTER_USER,
          variables: {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
          },
        },
        error: new Error('registration failed'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => expect(screen.getByText(/An error occurred. Please try again./i)).toBeInTheDocument());
  });
});
