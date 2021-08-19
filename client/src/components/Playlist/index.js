import React from 'react';
import Song from '../Song';

const Playlist = ({ playlist }) => {
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