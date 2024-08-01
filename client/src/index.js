// finance-manager/client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink, HttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
 
// Create an HttpLink to point to the GraphQL server
// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/graphql', // Change the port to 4000
// });
 
// // Create an authLink to include the token in the headers
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     }
//   };
// });
 
// // Initialize Apollo Client
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// });
 
 
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