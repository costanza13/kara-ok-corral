import React from 'react';
import { Link } from 'react-router-dom';
import FriendSearch from '../FriendSearch';

const FriendList = ({ friendCount, username, friends, handleRemoveFriend }) => {
 
  if (!friends || !friends.length) {
    return <p className="bg-dark text-light p-3">{username}, make some friends!</p>;
  }

  const handleClickRemove = async (username) => {
    handleRemoveFriend(username)
  };

  return (
    <div>
      {friends.map((friend, index) => (
        <button className="btn w-100 display-block mb-2" key={`friend${index}`}>
          <Link to={`/profile/${friend.username}`}>{friend.username} </Link>  
          <i className="fas fa-minus-circle fa-xs" onClick={() => handleClickRemove(friend.username)} ></i>
        </button>      
      ))}
      <FriendSearch />
    </div>
  );
};

export default FriendList;
