import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../utils/queries';
import Playlist from '../components/Playlist';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from "react-bootstrap/Spinner";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  console.log('playlistId', playlistId);
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};
  console.log(currentUser);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

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
  console.log(playlistData);
  const playlist = playlistData.playlist;
  const isOwner = playlist.username === currentUser.username;

  return (
    <Container>
      <Row xs={1} md={2}>
        <Col>
          <div className="breadcrumb">
            {
              isOwner
                ? <Link to="/dashboard">&larr; dashboard</Link>
                : <Link to="/">&larr; home</Link>
            }
          </div>
        </Col>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div className="playlist-list">
            <h3>Playlist:</h3>
            <Playlist
              key={playlist._id}
              playlistId={playlist._id}
            ></Playlist>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaylistPage;