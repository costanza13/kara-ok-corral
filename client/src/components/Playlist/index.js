import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import { SAVE_PLAYLIST } from '../../utils/mutations';
import Song from '../Song';
import Row from 'react-bootstrap/Row';

const Playlist = ({ playlistId }) => {
  const [editMode, setEditMode] = useState(false);
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });
  const [updatePlaylist] = useMutation(SAVE_PLAYLIST);

  if (loading) {
    return '';
  }

  let playlist;

  const handleAddMember = (e) => {
    e.preventDefault();

    console.log('hello');

    if (!editMode) {
      return setEditMode(true);
    }

  }

  const handleRemoveMember = async (e) => {
    const memberButton = e.target.closest('span');
    const removeUsername = memberButton.dataset.member;

    const members = playlist.members.filter(member => member !== removeUsername);

    console.log(memberButton);
    console.log(removeUsername);
    console.log('members', members);

    const { name, visibility } = playlist;

    const updatedPlaylist = await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { name, visibility, members } }
    });

    playlist = updatedPlaylist.playlist;
  }

  console.log(playlistData);
  playlist = playlistData.playlist;

  let partyMembers;
  const removeMemberButton = editMode ? <i className="fas fa-minus-circle" onClick={handleRemoveMember}></i> : '';

  if (playlist.members.length) {
    const memberButtons = playlist.members.map(member => {
      console.log(member);
      return <span key={member} className="btn btn-outline-primary" data-member={member}>{member} {removeMemberButton}</span>
    });
    if (memberButtons.length) {
      partyMembers = <p>with: {memberButtons} <button type="button" className="btn btn-link" onClick={handleAddMember}><i className="fas fa-plus-circle"></i></button></p>
    }

  } else {
    partyMembers = <p>{!editMode ? ' Add members to make this a party list!' : ''}<button type="button" className="btn btn-link" onClick={handleAddMember}><i className="fas fa-plus-circle"></i></button></p>
  }

  return (
      <Row>
        <h5>{playlist.name}</h5>
        {partyMembers}
        <div className="song-list">
          {playlist.songs.map((song) => {
            return <Song key={song._id} song={song}></Song>;
          })}
        </div>
      </Row>
  );
};

export default Playlist;