import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../utils/queries';
import Playlist from '../components/Playlist';
import PerformanceVideo from '../components/EmbeddedVideo';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from "react-bootstrap/Spinner";
// import Confetti from "react-confetti";

const PlaylistPage = () => {
  const [currentVideo, setVideo] = useState(null);
  const { playlistId } = useParams();
  console.log('playlistId', playlistId);
  const { loading, error, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  console.log('playlistId', playlistId);
  // if data isn't here yet, say so
  if (!playlistData && loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    if (error.toString().indexOf('NOT FOUND:') > -1) {
      return (
        <>
          <h1 className='display-2'>Not Found!</h1>
          <h2>We could not find the playlist you're looking for.</h2>
        </>
      )
    }
    if (error.message.indexOf('NOT AUTHORIZED:') > -1) {
      return (
        <>
          <h1 className='display-2'>Not AUTHORIZED!</h1>
          <h2>{
            Auth.loggedIn()
              ? 'You do not have permission to view this playlist.'
              : 'You might need to be logged in to view this playlist.'
          }</h2>
        </>
      )
    }
  }
  const playlist = playlistId !== "new" ? playlistData.playlist : { _id: null, username: currentUser.username };
  const isOwner = playlist.username === currentUser.username;

  const performanceVideo = currentVideo ?
    <PerformanceVideo videoUrl={currentVideo} />
    :
    '';


  return (
    <>
      <Container className="mt-4">
        {/* <Confetti confettiSource={(-10, 40, 1, 0)} /> */}
        <Row>
          <Playlist key={playlist._id} playlistId={playlist._id} setVideo={setVideo}></Playlist>
        </Row>
        <Row>
          <Col>
            {performanceVideo}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PlaylistPage;