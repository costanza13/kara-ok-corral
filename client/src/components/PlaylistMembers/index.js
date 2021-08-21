import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import EasyEdit from "react-easy-edit";

const PlaylistMembers = ({ members, canEdit, updateMembers }) => {
  const { loading, data } = useQuery(QUERY_ME);

  if (loading) {
    return <h1>LOADING...</h1>
  }

  console.log('ME', data.me);

  const friends = data.me.friends.map(friend => friend.username);

  console.log('MY FREINDS', friends);

  const handleAddMember = (e) => {
    const newMember = e.target.value;
    const updatedMembers = [...members];
    if (newMember) {
      if (members.indexOf(newMember) === -1 && friends.indexOf(newMember) !== -1) {
        updatedMembers.push(newMember);
        updateMembers(updatedMembers);
      } else {
        alert('You can only add your friends!');
      }
    }
  }

  const handleRemoveMember = async (e) => {
    const memberButton = e.target.closest('li');
    const removeUsername = memberButton.dataset.member;

    const updatedMembers = members.filter(member => member !== removeUsername);

    console.log(memberButton);
    console.log(removeUsername);
    console.log('updatedMembers', updatedMembers);

    updateMembers(updatedMembers);
  }

  let partyMembers = '';
  const removeMemberButton = canEdit ? <i className="fas fa-minus-circle" onClick={handleRemoveMember}></i> : '';

  if (members.length) {
    const memberButtons = members.map(member => {
      return <li key={member} className="btn btn-outline-primary member-button" data-member={member}>{member} {removeMemberButton}</li>
    });
    partyMembers = <ul>{memberButtons}</ul>
  }

  // build the "add a memnber" list
  const leftToAdd = friends.filter(friend => members.indexOf(friend) === -1);
  console.log('left to add', leftToAdd);

  return (
    <>
      {partyMembers}{' '}
      {
        canEdit && leftToAdd.length
          ? 
          <select defaultValue='' onChange={handleAddMember} className="btn btn-outline-primary member-button">
            <option value='' disabled={true}>add a friend</option>
            {leftToAdd.map(friend => { return <option>{friend}</option> } )}
          </select>
          : ''
      }
    </>
  );
};

export default PlaylistMembers;