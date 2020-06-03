import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

// Para decirle el servidor al que se va a conectar
// uri: 'http://localhost:4000/', Este era el antiguo de apollo, ahora hemos puesto el nuevo de heroku
const httpLink = createHttpLink({
    uri: 'https://hidden-ravine-19496.herokuapp.com/',
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