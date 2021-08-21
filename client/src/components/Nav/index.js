import React from 'react';
import { Link } from 'react-router-dom';
import { QUERY_ME } from '../../utils/queries';
import { useQuery } from '@apollo/client';


import Auth from '../../utils/auth';

const Nav = () => {

  const { loading, data: userData } = useQuery(QUERY_ME);

  if (loading) {
    return null
  }
  console.log(userData);
  const user = userData.me;

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };



  return (
    <header className="mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>The Kara-OK-Corral</h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to={`/profile/${user.username}`} className="btn btn-light py-1 mx-2">Profile</Link>
              <Link to="/dashboard" className="btn btn-light py-1 mx-2">Dashboard</Link>
              <a href="/" className="btn btn-light py-1 mx-2" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );

};

export default Nav;