import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import Song from '../Song';
import Row from 'react-bootstrap/Row';

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
      <Row>
        <h5>{playlist.name + partyFlag}</h5>
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