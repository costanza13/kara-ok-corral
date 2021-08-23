import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_FRIEND, REMOVE_FRIEND} from '../../utils/mutations';
import FriendSearch from '../FriendSearch';
import { QUERY_USERS } from '../../utils/queries';



const FriendList = ({ friendCount, username, friends, handleRemoveFriend }) => {
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [addFriend] = useMutation(ADD_FRIEND);
  const { loading: queryUsersLoading, data: usersData } = useQuery(QUERY_USERS);
 
  if (!friends || !friends.length) {
    return <p className="bg-dark text-light p-3">{username}, make some friends!</p>;
  }

  const handleClickRemove = async (username) => {
    handleRemoveFriend(username)
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

  return (
    <div>
      {friends.map(friend => (
        <button className="btn w-100 display-block mb-2" key={friend._id}>
          <Link to={`/profile/${friend.username}`}>{friend.username} </Link>  
          <i className="fas fa-minus-circle fa-xs" onClick={() => handleClickRemove(friend.username)} ></i>
        </button>      
      ))}
      <FriendSearch handleClick={handleClick} />
    </div>
  );
};

export default FriendList;
