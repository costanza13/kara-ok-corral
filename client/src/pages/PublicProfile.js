import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';
import { ListGroup } from 'react-bootstrap';

const PublicProfile = props => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

   const [addFriend] = useMutation(ADD_FRIEND, {
     update(cache, {data: { addFriend }}) {
       cache.modify({
         fields: {
           me(existingMeData) {
             return addFriend
           }
        }
       })
     }
   });

  if (loading) {
    return <div>Loading...</div>;
  }
  const user = data.user;

  // if (
  //     Auth.loggedIn() &&
  //     Auth.getProfile().data.username === userParam
  // ) {
  //     return "Welcome to your public profile page!"
  // }

   const handleClick = async (addUsername) => {
     try {
       await addFriend({
         variables: { username: addUsername }
       });
     } catch (e) {
       console.error(e);
    }
  };
 
  return (
    <Container>
      <Row className="pub-header">
        <Col xs={1}>
          <span>
            <i className="fas fa-hat-cowboy fa-md pub-user-icon"></i>
          </span>
        </Col>
        <Col xs={11}>
          <h2 className="pub-name">
            {userParam ? `${user.username}'s` : "your"} profile
            <button
              className="btn ml-auto"
              onClick={handleClick(user.username)}
            >
              Add Friend
            </button>
          </h2>
        </Col>
      </Row>
      <Row>
        <Col className="pub-friends">
          <div className="friend-count">
            <h3>{user.username} has ... </h3>
            <Row>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.friendCount}{" "}
                </span>{" "}
                <br></br>
                {user.friendCount === 1 ? "friend" : "friends"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.playlistCount}{" "}
                </span>
                <br></br>
                {user.playlistsCount === 1
                  ? "public playlist"
                  : "public playlists"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.songCount}{" "}
                </span>
                <br></br>
                {user.songCount === 1
                  ? "songs in the public playlist"
                  : "songs in public playlists"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.performanceCount}{" "}
                </span>
                <br></br>
                {user.performanceCount === 1
                  ? "public performance"
                  : "public performances"}
              </Col>
            </Row>
            <Row>
              <Col xs={11} md={6}>
                <div className="pub-play-list">
                  <p className="publist-header">{user.username} created:</p>
                  {user.playlists.map((playlist) => {
                    return (
                      <p className="pub-li" key={"li" + playlist._id}>
                        <Link
                          key={playlist._id}
                          to={`/playlist/${playlist._id}`}
                        >
                          {playlist.name}
                        </Link>
                      </p>
                    );
                  })}
                </div>
              </Col>
              <Col xs={11} md={6}>
                <div className="pub-play-list">
                  <p className="publist-header">{user.username} invited to:</p>
                  {user.partyPlaylists.map((playlist) => {
                    return (
                      <p className="pub-li" keys={"li" + playlist._id}>
                        <Link
                          key={playlist._id}
                          to={`/partyPlaylist/${playlist._id}`}
                        >
                          {playlist.name}
                        </Link>
                      </p>
                    );
                  })}
                </div>
                {console.log(user)}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicProfile;