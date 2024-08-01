import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title ,LinkButton } from '../styles';
import loginImage from '../img.jpeg'; // Import your image

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      localStorage.setItem('token', data.login);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');

      console.error(error);
    }
  };

  return (
    <Container>
        <div style={{ textAlign: 'right', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
      <Title> Personal Finance Management</Title>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={loginImage} alt="Login" style={{ width: '40%', height: 'auto', marginRight: '10px',marginLeft: '30px' }} />
        <div style={{ width: '50%' }}>
            
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
        </Form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>Don't have an account? <LinkButton to="/register">Register</LinkButton></p>
      </div>
       </div> 
    </Container>
  );
}

export default Login;
