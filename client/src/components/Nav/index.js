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

  const user = userData ? userData.me : null;

  if ((!user && Auth.loggedIn()) || (!!user && !Auth.loggedIn())) {
    Auth.logout();
  }

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <>
      <header>
        <Link to="/">
          <h1>The Kara-OK-Corral</h1>
        </Link>
        <Nav className="justify-content-center">
          {Auth.loggedIn() ? (
            <>
              <Nav.Item>
                <Link to={`/profile/${user.username}`}>
                  Profile
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/dashboard">Dashboard</Link>
              </Nav.Item>
              <Nav.Item>
                <a href="/" onClick={logout}>
                  Logout
                </a>
              </Nav.Item>
            </>
          ) : (
            <Nav.Link onClick={() => setShowModal(true)}>
              <span>Login </span>|| <span>Sign Up</span>
            </Nav.Link>
          )}
        </Nav>
      </header>

      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"

      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav>
                <Nav.Link eventKey="login">
                  <span className="login-signup">Login</span>
                </Nav.Link>
                <Nav.Link eventKey="signup">
                  <span className="login-signup">Sign Up</span>
                </Nav.Link>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
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