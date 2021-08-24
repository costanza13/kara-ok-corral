import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FriendList from '../components/FriendList';
import { Container, Row, Col } from 'react-bootstrap';


import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';

const PublicProfile = props => {
  const { username: userParam } = useParams();

  const [addFriend] = useMutation(ADD_FRIEND);

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { username: userParam }
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

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
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
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3} className="pub-friends">
            <p className="friend-count">
              {user.username} has {user.friendCount}{" "}
              {user.friendCount === 1 ? "friend" : "friends"}
            </p>
            {userParam && (
              <button className="btn ml-auto" onClick={handleClick}>
                Add Friend
              </button>
            )}
          </Col>
          <Col xs={12}>
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PublicProfile;