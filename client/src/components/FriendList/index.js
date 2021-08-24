import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import { REMOVE_FRIEND } from '../../utils/mutations';
import { Link } from 'react-router-dom';
import FriendSearch from '../FriendSearch';
import { ADD_FRIEND } from '../../utils/mutations';

const FriendList = ({ username, friends, setFriendCount }) => {
  const [addFriend] = useMutation(ADD_FRIEND);
  const [removeFriend, { loading: removing, data: removeData }] = useMutation(REMOVE_FRIEND);

  let localFriends;

  if (removing) {
    return <span>Removing...</span>;
  }

  if (!friends || !friends.length) {
    return <p className="bg-dark text-light p-3">{username}, make some friends!</p>;
  }

  const handleClickRemove = async (removeUsername) => {
    try {
      const updatedUser = await removeFriend({
        variables: { username: removeUsername }
      });

      console.log('JUST UPDATED', updatedUser);
      setFriendCount(updatedUser.data.removeFriend.friendCount);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = async (username) => {
    try {
      await addFriend({
        variables: { username }
      });    
    } catch (e) {
      console.error(e);
    }
  };
  console.log('rd', removeData);
  localFriends = removeData ? removeData.removeFriend.friends : friends;

  return (
    <div>
      {localFriends.map((friend, index) => (
        <button className="btn w-100 display-block mb-2" key={`friend${index}`}>
          <Link to={`/profile/${friend.username}`}>{friend.username} </Link>
          <i className="fas fa-minus-circle fa-xs friend-delete" onClick={() => handleClickRemove(friend.username)} ></i>
        </button>
      ))}
      <FriendSearch handleClick={handleClick} />
    </div>
  );
};

export default FriendList;
