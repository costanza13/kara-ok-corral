import React from 'react';
import Song from '../components/Song';

const Playlist = () => {
   return (
     <div>
       <h5>Super Cool Playlist Name</h5>
       <button>+</button>
       <div className="song-list">
         <Song></Song>
       </div>
     </div>
   );
};

export default Playlist;