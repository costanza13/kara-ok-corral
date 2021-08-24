import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FriendList from '../components/FriendList';


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
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile
        </h2>
        <h3>{user.username} has {user.friendCount} {user.friendCount === 1 ? 'friend' : 'friends'}</h3>
        <ul>
          {user.playlists.map((playlist) => {

            return (

              <li key={'li' + playlist._id}>
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                >{playlist.name}</Link>
              </li>
            );
          })}
        </ul>
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

    </div>
  );
};

export default PublicProfile;