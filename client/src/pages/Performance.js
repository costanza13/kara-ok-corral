import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PERFORMANCE } from '../utils/queries';
import { ADD_REACTION, REMOVE_REACTION } from '../utils/mutations';
import EmbeddedVideo from '../components/EmbeddedVideo';
import Auth from '../utils/auth';
import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from "react-bootstrap/Spinner";

const Performance = () => {
  // const [currentVideo, setCurrentVideo] = useState(null);
  const [reactionInput, setReactionInput] = useState('');
  const [reactions, setReactions] = useState();
  const { performanceId } = useParams();
  const { loading, error, data: performanceData } = useQuery(QUERY_PERFORMANCE, { variables: { performanceId } });
  const [addReaction] = useMutation(ADD_REACTION);
  const [removeReaction] = useMutation(REMOVE_REACTION);

  const reactionSubmit = async () => {
    // reaction submission magic here!
    console.log(reactionInput);

    const reactionsUpdated = await addReaction({
      variables: { performanceId, reactionBody: reactionInput }
    });

    if (reactionsUpdated) {
      console.log(reactionsUpdated);
      // setReactions()
    }
  };

  const reactionDelete = async reactionId => {
    // reaction delete magic here!
    console.log(reactionInput);

    const reactionsUpdated = await removeReaction({
      variables: { performanceId, reactionId }
    });

    if (reactionsUpdated) {
      console.log(reactionsUpdated);
      // setReactions()
    }
  }

  // if data isn't here yet, say so
  if (!performanceData && loading) {
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
          <h2>We could not find the performance you're looking for.</h2>
        </>
      )
    }
    if (error.message.indexOf('NOT AUTHORIZED:') > -1) {
      return (
        <>
          <h1 className='display-2'>Not AUTHORIZED!</h1>
          <h2>{
            Auth.loggedIn()
              ? 'You do not have permission to view this performance.'
              : 'You might need to be logged in to view this performance.'
          }</h2>
        </>
      )
    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (!value[value.length - 1].match(/\n/)) {
      setReactionInput(value);
    }
  };

  const handleKeyUp = (e) => {
    switch (e.key) {
      case 'Escape':
        setReactionInput('');
        break;
      case 'Enter':
        reactionSubmit();
        break;
      default:
        // do nothing
    }
  }

  console.log(performanceData);
  const { username, url, song } = performanceData.performance;

  if (reactions.length === 0 && performanceData.performance.reactions.length) {
    setReactions(performanceData.performance.reactions);
  }

  return (
    <Container>
      <Row>
        <Col className='text-center'>
          <h1 className='performance-headline'>{song.title} - {song.artist}!</h1>
          <h2 className='performance-byline'>A performance by {username}!</h2>
        </Col>
      </Row>
      <Row>
        <Col className='performance-video'>
          <EmbeddedVideo title={song.title} artist={username} url={url} />
        </Col>
      </Row>
      <Row>
        <Col className='reaction-section'>
          <h3>Let's hear it for <Link to={`/profile/${username}`}>{username}</Link>!</h3>
          <div className='reactions'>
            {
              reactions.map(reaction => {
                return <div className="reaction">
                  <div className='reaction-body'>{reaction.reactionBody}</div>
                  <div className='reaction-byline'><Link to={`/profile/${reaction.username}`}>{reaction.username}</Link> - {reaction.createdAt}</div>
                </div>
              })
            }
            <div className='reaction-form'>
              <textarea id='reaction-text-input' onChange={(e) => handleChange(e)} onKeyUp={(e) => handleKeyUp(e)} value={reactionInput} placeholder={`some kind words for ${username}`} />
              <span className='reaction-submit'><i className="far fa-share-square fa-2x" onClick={reactionSubmit}></i></span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default Performance;