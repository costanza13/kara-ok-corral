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
    <div></div>
  );
};

export default PublicProfile;