import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import fuzzySearch from 'fz-search';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_USER, QUERY_USERS } from '../../utils/queries';
import { ADD_FRIEND, REMOVE_FRIEND} from '../../utils/mutations';

const FriendSearch = () => {
//const [addFriend, {data: addFriendData, loading1}] = useMutation(ADD_FRIEND);
const [addFriend] = useMutation(ADD_FRIEND);

const [value, setValue] = useState("");
const [fuzzyValue, setFuzzyValue] = useState("");
const { loading: queryUsersLoading, data: usersData } = useQuery(QUERY_USERS);

const handleInputOnChange = e => {
    setValue(e.target.value)
    const searcher = new fuzzySearch({ source: usersData.users, keys: ["username"] });   
    setFuzzyValue(searcher.search(e.target.value))
  }

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
    <>
        <button className="btn ml-auto" onClick={handleClick}>
                Add Friend
              </button> 
        <input value={value} onChange={handleInputOnChange} type="text" />
        {(fuzzyValue.length > 0 && <div>
               {fuzzyValue.map(user => <button className="btn ml-auto" onClick={() => handleClick(user.username)} >
                {user.username} 
                </button>)} 
                </div>
        )}
    </>
  )
};

export default FriendSearch;