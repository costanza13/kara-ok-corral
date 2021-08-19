import React from 'react';

const Dashboard = () => {
   return (
     <div>
       <h2>Your Name</h2>
       <p>Friends: 100</p>
       <div>
         <button>+</button>
         <h3>Playlists:</h3>
            <div className="playlist-list">
               <h5>Super Cool Playlist Name</h5>
            </div>
       </div>
     </div>
   );
};

export default Dashboard;