import React from 'react';
import { useMutation } from '@apollo/client'
import { REMOVE_FRIEND } from '../../utils/mutations';
import { Link } from 'react-router-dom';
import FriendSearch from '../FriendSearch';
import { ADD_FRIEND } from '../../utils/mutations';

const FriendList = ({ username, friends, setFriendCount }) => {

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
 
  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    update(cache, {data: { removeFriend }}) {
      cache.modify({
        fields: {
          me(existingMeData) {
            return removeFriend
          }
        }
      })
    }
  });

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
      console.log("updated user:");
       console.log(updatedUser);
       setFriendCount(updatedUser.data.addFriend.friendCount);
     } catch (e) {
       console.error(e);
     }
   };

  if (!friends || !friends.length) {
    return (
      <>
        <p className="bg-dark text-light p-3">{username}, make some friends!</p>
        <FriendSearch exclude={[...friends, username]} handleClick={handleClickAdd} />
      </>
    )
  }

  return (
    <div>
      {friends.map((friend, index) => (
        <button className="btn w-100 display-block mb-2" key={`friend${index}`}>
          <Link to={`/profile/${friend.username}`}>{friend.username} </Link>
          <i className="fas fa-minus-circle fa-xs friend-delete" onClick={() => handleClickRemove(friend.username)} ></i>
        </button>
      ))}
      <FriendSearch exclude={[...friends, username]} handleClick={handleClickAdd} />
    </div>
  );
};

export default FriendList;
