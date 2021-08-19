import React from 'react';


const SongForm = () => {
   return (
      <div>
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
            <button type="submit" class="btn btn-primary">add song</button>
         </form>
      </div>
   );
}

export default SongForm;