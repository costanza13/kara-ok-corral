import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import Spinner from "react-bootstrap/Spinner";
import './PlaylistMembers.css';

const PlaylistMembers = ({ members, canEdit, updateMembers }) => {
  const { loading, data } = useQuery(QUERY_ME);

  if (loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const friends = canEdit && data ? data.me.friends.map(friend => friend.username) : [];

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

    updateMembers(updatedMembers);
  }

  let partyMembers = '';
  const removeMemberButton = canEdit ? <i className="fas fa-minus-circle fa-xs" onClick={handleRemoveMember}></i> : '';

  if (members.length) {
    const memberButtons = members.map(member => {
      return (
        <span
          key={member}
          className="btn member-button"
          data-member={member}
        >
          {member} {removeMemberButton}
        </span>
      );
    });
    partyMembers = memberButtons;
  }

  // build the "add a memnber" list
  const leftToAdd = friends.filter(friend => members.indexOf(friend) === -1);

  return (
    <div className="btn-group d-inline-block members-panel" role="group">
      {
        members.length === 0 && leftToAdd.length && canEdit ?
          (
            <span className="h-100 align-middle member-text">
              Add your friends to make this a party list!
            </span>
          ) : (
            members.length !== 0 ? (
              <span className="d-inline-block h-100 align-middle member-text">
                Members{" "}
              </span>
            ) : (
              ''
            )
          )
      }
      <div className="members-list">

        {canEdit && leftToAdd.length ? (
          <select
            defaultValue=""
            onChange={handleAddMember}
            className="btn btn-outline add-member-button"
          >
            <option key="default" value="" disabled={true}>
              add a friend
            </option>
            {leftToAdd.map((friend) => {
              return (
                <option key={friend} value={friend}>
                  {friend}
                </option>
              );
            })}
          </select>
        ) : (
          ""
        )}

        {partyMembers}

      </div>
    </div>
  );
};

export default PlaylistMembers;