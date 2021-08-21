import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../utils/queries';
import Playlist from '../components/Playlist';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';

const PlaylistPage = () => {
  const { playlistId } = useParams();
  console.log('playlistId', playlistId);
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  // const token = Auth.loggedIn() ? Auth.getToken() : null;

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  console.log(playlistData);
  const playlist = playlistData.playlist;
  const isOwner = playlist.username === currentUser.username;
  const isMember = playlist.members.indexOf(currentUser.Usename) > -1;

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
          <h3>Playlist:</h3>
          <Playlist
            key={playlist._id}
            playlistId={playlist._id}
          ></Playlist>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaylistPage;