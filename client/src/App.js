import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import Home from './pages/Home';
import PublicProfile from './pages/PublicProfile';
import Dashboard from './pages/Dashboard';
import Playlist from './pages/Playlist';
import Party from './pages/Party';
import Performance from './pages/Performance';
import Nav from './components/Nav';
import Login from './components/LoginForm';
import Signup from './components/SignupForm';
import Footer from './components/Footer';


const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Nav />
       
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/party/:playlistId" component={Party} />
            <Route exact path="/playlist/:playlistId" component={Playlist} />
            <Route exact path="/performance/:performanceId" component={Performance} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile/:username" component={PublicProfile} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        
        </>
      </Router>
      <Footer />
    
    </ApolloProvider>
    
  );
}

export default App;