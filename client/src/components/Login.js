import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title, LinkButton } from '../styles';
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

  // In your login component
const handleLogin = async () => {
  // ... login logic ...
  if (loginSuccessful) {
      navigate('/dashboard', { replace: true });
  }
};
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
      <div id="header" style={{ textAlign: 'right', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
        <Title>Personal Finance Management</Title>
      </div>
      <div id="content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img id="login-image" src={loginImage} alt="Login" style={{ width: '40%', height: 'auto', marginRight: '10px', marginLeft: '30px' }} />
        <div id="login-form-container" style={{ width: '50%' }}>
          <Title>Login</Title>
          <Form id="login-form" onSubmit={handleSubmit}>
            <Input
              id="username-input"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button id="login-button" type="submit">Login</Button>
          </Form>
          {error && <p id="error-message" style={{ color: 'red' }}>{error}</p>}
          <p>Don't have an account? <LinkButton id="register-link" to="/register">Register</LinkButton></p>
        </div>
      </div> 
    </Container>
  );
}

export default Login;