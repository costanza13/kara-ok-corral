import React from 'react';

const Song = () => {
   return (
      <div>
         <div className="song-form">
            <form>
            <div className="mb-3">
               <input type="text" className="form-control" id="songTitle" placeholder="song title"></input>
            </div>
            <div className="mb-3">
               <input type="text" className="form-control" id="songArtist" placeholder="artist"></input>
            </div>
            <div className="mb-3">
               <input type="url" className="form-control" id="lyrics" placeholder="link to lyrics"></input>
            </div>
            <div className="mb-3">
               <input type="url" className="form-control" id="youtube" placeholder="link to youtube"></input>
            </div>
            <button type="submit" className="btn btn-primary">add song</button>
         </form>
         </div>

         <div className="song-display">
            <h6>Tu Me Dejaste de Querer</h6>
            <p>C. Tangana</p>
            <p><a href="https://genius.com/C-tangana-la-hungara-and-nino-de-elche-tu-me-dejaste-de-querer-lyrics" target="_blank" rel="noreferrer">lyrics</a>{' - '}
            <a href="https://www.youtube.com/watch?v=ET5DAb4Bri0" target="_blank" rel="noreferrer">youtube</a></p>
            <button className="btn btn-primary edit-song">edit</button>
            <button className="btn btn-primary delete-song">delete</button>
         </div>
      </div>
   );
};

export default Song;