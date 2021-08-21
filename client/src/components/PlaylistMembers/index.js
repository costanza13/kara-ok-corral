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
    e.target.value = '';
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
    const memberButton = e.target.closest('span');
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
      return <span key={member} className="btn btn-primary m-1 member-button" data-member={member}>{member} {removeMemberButton}</span>
    });
    partyMembers = memberButtons;
  }

  // build the "add a memnber" list
  const leftToAdd = friends.filter(friend => members.indexOf(friend) === -1);
  console.log('left to add', leftToAdd);

  return (
    <div className="btn-group my-2" role="group">
      {partyMembers}
      {
        canEdit && leftToAdd.length
          ?
          <select defaultValue='' onChange={handleAddMember} className="btn btn-outline-primary mx-1 member-button">
            <option key='default' value='' disabled={true}>add a friend</option>
            {leftToAdd.map(friend => { return <option key={friend} value={friend}>{friend}</option> })}
          </select>
          : ''
      }
    </div>
  );
};

export default PlaylistMembers;