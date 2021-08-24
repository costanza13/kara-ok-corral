import React, { useState } from 'react';
import fuzzySearch from 'fz-search';
import { useQuery} from '@apollo/client';
import { QUERY_USERS } from '../../utils/queries';


const FriendSearch = ({handleClick}) => {

const [value, setValue] = useState("");
const [fuzzyValue, setFuzzyValue] = useState("");
const { loading: queryUsersLoading, data: usersData } = useQuery(QUERY_USERS);


const handleInputOnChange = e => {
    setValue(e.target.value)
    const searcher = new fuzzySearch({ source: usersData.users, keys: ["username"] });   
    setFuzzyValue(searcher.search(e.target.value))
}

  const handleClickAdd = async (username) => {
    handleClick(username)
};

  return (
    <>
        <button className="btn ml-auto" onClick={handleClick}>
                Add Friend
        </button>  
        
          <input value={value} onChange={handleInputOnChange} type="text" />
        
        {(fuzzyValue.length > 0 && <div>
               {fuzzyValue.map(user => <button className="btn ml-auto" onClick={() => handleClickAdd(user.username)} >
                {user.username} 
                </button>)} 
                </div>
        )} 
       
        </>
    )}
           
   
export default FriendSearch;