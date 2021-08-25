import React, { useState } from 'react';
import fuzzySearch from 'fz-search';
import { useQuery} from '@apollo/client';
import { QUERY_USERS } from '../../utils/queries';
import { InputGroup, FormControl } from 'react-bootstrap';


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
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">
          <span className="add-friend-btn">
            <i className="fas fa-user-plus fa-sm"></i>
          </span>
        </InputGroup.Text>
        <FormControl
          className="friend-input"
          value={value}
          onChange={handleInputOnChange}
          type="text"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      {fuzzyValue.length > 0 && (
        <div>
          {fuzzyValue.map((user) => (
            <button
              className="btn ml-auto"
              onClick={() => handleClickAdd(user.username)}
            >
              {user.username}
            </button>
          ))}
        </div>
      )}
    </>
  );}
           
   
export default FriendSearch;