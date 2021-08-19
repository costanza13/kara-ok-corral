import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import Song from '../Song';

const Playlist = ({ playlistId }) => {
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  if (loading) {
    return '';
  }

  console.log(playlistData);
  const playlist = playlistData.playlist;

  const partyFlag = playlist.members.length ? ' (party)' : '';
  const partyMembers = playlist.members.length ? <p>with: {playlist.members.join(', ')}</p> : '';
  return (
    <div>
      <h5>{playlist.name + partyFlag}</h5>
      {partyMembers}
      <button>+</button>
      <div className="song-list">
        <Song></Song>
      </div>
    </div>
  );
};

export default Playlist;