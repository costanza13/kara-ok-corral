import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FriendSearch from '../FriendSearch';

const FriendList = ({ friendCount, username, friends, handleRemoveFriend }) => {
  const [localFriends, setLocalFriends] = useState([...friends]);

  if (!friends || !friends.length) {
    return <p className="bg-dark text-light p-3">{username}, make some friends!</p>;
  }

  const handleClickRemove = (removeUsername) => {
    console.log(localFriends);
    const newFriends = localFriends.filter(username => username !== removeUsername);
    setLocalFriends(newFriends);
    console.log(localFriends);
    handleRemoveFriend(removeUsername)
  };

  return (
    <div>
      {localFriends.map((friend, index) => (
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
