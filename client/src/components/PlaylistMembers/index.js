import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';

const PlaylistMembers = ({ members, canEdit, updateMembers }) => {
  const { loading, userData } = useQuery(QUERY_ME);

  let friends = [];
  if (userData) {
    console.log('playlist user', userData);
    friends = userData.me.friends;
  } else if (loading) {
    console.log('loading user data...');
    return null;
  }

  const handleAddMember = (e) => {
    const newMember = e.target.value;

    const updatedMembers = [...members];
    if (newMember) {
      if (members.indexOf(newMember) === -1) {
        updatedMembers.push(newMember);
      }
    }

    updateMembers(updatedMembers);
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
      console.log(member);
      return <li key={member} className="btn btn-outline-primary member-button" data-member={member}>{member} {removeMemberButton}</li>
    });
    partyMembers = <ul>{memberButtons}</ul>
  }

  return (
    <>
      {partyMembers}
      {
        canEdit
          ? <input type="text" placeholder="add a friend" onBlur={handleAddMember} />
          : ''
      }
    </>
  );
};

export default PlaylistMembers;