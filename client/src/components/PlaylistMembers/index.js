import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';

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

  return (
    <>
      {partyMembers}
      {
        canEdit
          ? <input name="friend-to-add" type="text" placeholder="add a friend" onBlur={handleAddMember} />
          : ''
      }
    </>
  );
};

export default PlaylistMembers;