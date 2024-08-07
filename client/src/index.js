// finance-manager/client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink, ApolloLink, from } from '@apollo/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
 
 
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});
 
const authLink = new ApolloLink((operation, forward) => {
  // Add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}` || '',
    }
  });
  return forward(operation);
});
 
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
// Create and render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
 
reportWebVitals();