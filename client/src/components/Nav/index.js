import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from '../SignupForm';
import LoginForm from '../LoginForm';
import Auth from '../../utils/auth';
import { QUERY_ME } from '../../utils/queries';
import { useQuery } from '@apollo/client';

const AppNavBar = () => {

  const { loading, data: userData } = useQuery(QUERY_ME);
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return null
  }
  console.log(userData);
  const user = userData ? userData.me : {};

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <>
      <header className="py-2 flex-row align-center">
        <div className="container flex-row justify-space-between-lg justify-center align-center">
          <Link to="/">
            <h1>The Kara-OK-Corral</h1>
          </Link>

          <nav className="text-center">

            {Auth.loggedIn() ? (
              <>
                <Link to={`/profile/${user.username}`} className="btn btn-light py-1 mx-2 d-inline-block">Profile</Link>
                <Link to="/dashboard" className="btn btn-light py-1 mx-2 d-inline-block">Dashboard</Link>
                <a href="/" className="btn btn-light py-1 mx-2 d-inline-block" onClick={logout}>
                  Logout
                </a>
              </>
            ) : (
              <Nav.Link onClick={() => setShowModal(true)} className="btn btn-light py-1 mx-2 d-inline-block">Login/Sign Up</Nav.Link>

            )}
          </nav>
        </div>
      </header>

      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );

};

export default AppNavBar;