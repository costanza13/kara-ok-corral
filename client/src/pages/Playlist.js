import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../utils/queries';
import Playlist from '../components/Playlist';
import EmbeddedVideo from '../components/EmbeddedVideo';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from "react-bootstrap/Spinner";
// import Confetti from "react-confetti";

const PlaylistPage = () => {
  const { playlistId: playlistIdParam } = useParams();
  const [playlistId, setPlaylistId] = useState(playlistIdParam);
  const [currentVideo, setCurrentVideo] = useState(null);
  const { loading, error, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  // if data isn't here yet, say so
  if (!playlistData && loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (playlistId && playlistId !== 'new' && error) {
    if (error.message.indexOf('NOT FOUND:') > -1) {
      return (
        <div className='error'>
          <h1 className='display-2'>Not Found!</h1>
          <h2>We could not find the playlist you're looking for.</h2>
        </div>
      )
    }
    if (error.message.indexOf('FORBIDDEN:') > -1) {
      return (
        <div className='error'>
          <h1 className='display-2'>Not AUTHORIZED!</h1>
          <h2>{
            Auth.loggedIn()
              ? 'You do not have permission to view this playlist.'
              : 'You might need to be logged in to view this playlist.'
          }</h2>
        </div>
      )
    }
  }

  const setVideo = (video) => {
    setCurrentVideo({ ...video });
  };

  const updatePlaylistId = (newId) => {
    if (!playlistId || playlistId !== newId) {
      window.history.pushState("The Kara-OK Corral", "The Kara-OK Corral", `/playlist/${newId}`);
    }
    setPlaylistId(newId);
  }

  return (
    <>
      <Container className="mt-4">
        {/* <Confetti confettiSource={(-10, 40, 1, 0)} /> */}
        <Row>
          <Playlist key={playlistId} playlistId={playlistId} setVideo={setVideo} updatePlaylistId={updatePlaylistId} />
        </Row>
        <Row>
          <Col>
            {currentVideo ?
              <EmbeddedVideo title={currentVideo.title} artist={currentVideo.artist} url={currentVideo.videoUrl} />
              :
              ''}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PlaylistPage;