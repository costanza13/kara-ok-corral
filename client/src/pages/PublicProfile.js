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
    <div>
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
                <Col xs={6} md={{span: 3, offset: 3}}>
                  <span className="stats-number pub-stats">{user.friendCount} </span> <br></br>
                  {user.friendCount === 1 ? "friend" : "friends"}
                </Col>
                <Col xs={6} md={{span: 3, offset: 2}}>
                  <span className="stats-number pub-stats">{user.playlistCount} </span><br></br>
                  {user.playlistsCount === 1
                    ? "public playlist"
                    : "public playlists"}
                </Col>
              </Row>
              <Row>
                <Col xs={11} md={{span: 10, offset: 1}}>
                  <div className="pub-play-list">
                    <p className="publist-header">Playlists:</p>
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
              </Row>
              {console.log(user)}
            </div>
          </Col>
          {/* <Col xs={12}>
            <ul>
              {user.playlists.map((playlist) => {
                return (
                  <li key={"li" + playlist._id}>
                    <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                      {playlist.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
};

export default PublicProfile;