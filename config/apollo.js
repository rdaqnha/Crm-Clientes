import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

// Para decirle el servidor al que se va a conectar
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch
});

// Para sobreescribir las cabeceras
const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

// Conexión de Apollo
const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;