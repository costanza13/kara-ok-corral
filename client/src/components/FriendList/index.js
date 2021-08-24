import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import { REMOVE_FRIEND } from '../../utils/mutations';
import { Link } from 'react-router-dom';
import FriendSearch from '../FriendSearch';
import { ADD_FRIEND } from '../../utils/mutations';

const FriendList = ({ username, friends, setFriendCount }) => {
  

  const [removeFriend, { loading: removing, data: removeData }] = useMutation(REMOVE_FRIEND);
  const [addFriend, { loading: adding, data: addData }] = useMutation(ADD_FRIEND);
 
  let localFriends;

  if (removing) {
    return <span>Removing...</span>;
  }

  if (adding) {
    return <span>...Adding</span>
  }

  // if (!friends || !friends.length) {
  //   return <p className="bg-dark text-light p-3">{username}, make some friends!</p>;
   
  // }

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

  const handleClickAdd = async (addUsername) => {
    try {
      const updatedUser = await addFriend({
        variables: { username: addUsername }
      });   
      setFriendCount(updatedUser.data.addFriend.friendCount);
    } catch (e) {
      console.error(e);
    }
  };

  console.log('rd', removeData);
  console.log('ad', addData);
  
          

  //localFriends = removeData ? removeData.removeFriend.friends : friends && addData ? addData.addFriend.friends : friends;
  console.log('friends', localFriends)

  localFriends = removeData ? removeData.removeFriend.friends : addData ? addData.addFriend.friends : friends;

  return (
    <div>
       <p className="bg-dark text-light p-3">{username}, make some friends!</p>
        {localFriends.map((friend, index) => (
        <button className="btn w-100 display-block mb-2" key={`friend${index}`}>
          <Link to={`/profile/${friend.username}`}>{friend.username} </Link>
          <i className="fas fa-minus-circle fa-xs" onClick={() => handleClickRemove(friend.username)} ></i>
        </button>
      ))}
      <FriendSearch handleClick={handleClickAdd} />
    </div>
  );
};

export default FriendList;
