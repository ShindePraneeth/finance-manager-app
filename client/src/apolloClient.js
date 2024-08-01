import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HttpLink to point to the GraphQL server
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Ensure this points to your GraphQL server
});

// Create a context link to include authentication headers
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Combine authLink and httpLink into a single ApolloLink
const link = ApolloLink.from([authLink, httpLink]);

// Initialize Apollo Client
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;
