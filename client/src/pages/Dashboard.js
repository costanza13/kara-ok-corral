import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Playlist from '../components/Playlist';
import FriendsList from '../components/FriendList';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';

const Dashboard = () => {
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
    return <h2>LOADING...</h2>;
  }
  console.log(userData);
  const user = userData.me;

  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={8}>
          <h2>{user.username}</h2>
        </Col>
        <Col xs={6} md={4}>
          <p>Friends: {user.friendCount}</p>
          <FriendsList friends={user.friends} />
        </Col>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div className="playlist-list">
            <h5>Your Playlists</h5>
            {user.playlists.map((playlist) => {
              return (
                <Playlist
                  key={playlist._id}
                  playlistId={playlist._id}
                ></Playlist>
              );
            })}
          </div>
        </Col>
        <Col>
          <div className="playlist-list">
            <h5>Party Playlists</h5>
            {user.partyPlaylists.map((playlist) => {
              return (
                <Playlist
                  key={playlist._id}
                  playlistId={playlist._id}
                ></Playlist>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;