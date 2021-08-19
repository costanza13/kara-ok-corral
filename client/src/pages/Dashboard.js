import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Playlist from '../components/Playlist';
import FriendsList from '../components/FriendList';
import Auth from '../utils/auth';

const Dashboard = () => {
  const { loading, data: userData } = useQuery(QUERY_ME);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return (
      <div>
        <h2>You must be logged in to see this page.</h2>
        {/* do we want to include the login form here? */}
      </div>
    );
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  console.log(userData);
  const user = userData.me;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>Friends: {user.friendCount}</p>
      <FriendsList friends={user.friends} />
      <div>
        <button>+</button>
        <h3>Playlists:</h3>
        <div className="playlist-list">
          <h5>Your Playlists</h5>
          {user.playlists.map(playlist => {
            return <Playlist key={playlist._id} playlist={playlist}></Playlist>
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;