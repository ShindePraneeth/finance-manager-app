//finance-manager\client\src\components\Login.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Title, LinkButton } from'../styles';
import loginImage from '../img.jpeg'; // Import your image
//client\src\components\login img.jpeg
function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { username: usernameOrEmail, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid credentials');
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
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
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
      <p>Don't have an account? <LinkButton to="/register">Register</LinkButton></p>
      </div>
      </div>
    </Container>
  );
}

export default Login;