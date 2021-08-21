import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import { SAVE_PLAYLIST } from '../../utils/mutations';
import Auth from '../../utils/auth';
import Song from '../Song';
import PlaylistMembers from '../PlaylistMembers';

const Playlist = ({ playlistId }) => {
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });
  const [updatePlaylist] = useMutation(SAVE_PLAYLIST);

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  if (loading) {
    return null;
  }

  let playlist;
  const updateMembers = async (updatedMembers) => {
    const { name, visibility } = playlist;
    const updatedPlaylist = await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { name, visibility, members: updatedMembers } }
    });

    playlist = await updatedPlaylist.playlist;
    console.log('updated playlist', playlist);
  }

  console.log(playlistData);
  playlist = playlistData.playlist;
  const isOwner = playlist.username === currentUser.username;
  const isMember = playlist.members.indexOf(currentUser.Usename) > -1;

  console.log('orig playlist', playlist);

  return (
    <>
      <h5>{playlist.name}</h5>
      {playlist.members.length === 0 ? 'Add your friends to make this a party list!' : ''}
      <PlaylistMembers members={playlist.members} canEdit={isOwner} updateMembers={updateMembers} />
      <div className="song-list">
        {playlist.songs.map((song) => {
          return <Song key={song._id} song={song}></Song>;
        })}
        {
          isMember || isOwner
            ? 'you can add songs'
            : ''
        }
      </div>
    </>
  );
};

export default Playlist;