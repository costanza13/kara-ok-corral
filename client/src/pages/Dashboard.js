import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Playlist from '../components/Playlist';
import FriendsList from '../components/FriendList';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const { loading, data: userData } = useQuery(QUERY_ME);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return (
      <div>
        <h2>You must be logged in to see this page.</h2>
        {/* do we want to include the login form here? */}
      </div>
    );
  }

  // if data isn't here yet, say so
  if (loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  console.log(userData);
  const user = userData.me;

  function FriendsOffCanvas() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <p className="me-2 friends-toggle" variant="primary" onClick={handleShow}>Friends: {user.friendCount}</p>
        <Offcanvas show={show} onHide={handleClose} placement="end" scroll={true} backdrop={false}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Your Friends:</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <FriendsList friends={user.friends} />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <Container>
      <Row>
        <div className="user-info">
          <span>
            <i className="fas fa-hat-cowboy fa-lg user-icon"></i>
          </span>
          <h2 className="username">
            {user.username}
            <br></br>
            <span className="friend-count">
              <FriendsOffCanvas />
            </span>
          </h2>
        </div>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div className="playlist-list">
            <h3>Your Playlists</h3>
            <ul>
              {user.playlists.map((playlist) => {
                return (
                  <li key={"li" + playlist._id}>
                    <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                      {playlist.name}
                    </Link>
                    {playlist.members.length ? " (party)" : ""}
                  </li>
                );
              })}
              <li key={"linew_playlist"}>
                <Link key={"new_playlist"} to={"/playlist/new"}>
                  <em>create a new playlist &raquo;</em>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col>
          <div className="playlist-list">
            <h3>Party Playlists</h3>
            {user.partyPlaylists.map((playlist) => {
              return (
                <li key={"li" + playlist._id}>
                  <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                    {playlist.name}
                  </Link>
                </li>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;