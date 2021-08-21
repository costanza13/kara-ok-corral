import React, { useState } from 'react';
import Accordion from "react-bootstrap/Accordion";
import Collapse from 'react-bootstrap/esm/Collapse';

const Song = ({ song }) => {
   const [open, setOpen] = useState(false);

   const [editStatus, setEditStatus] = useState(false);

   return (
      <div>
         {editStatus &&
         (<div className="song-form">
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
         </div>)}

         {/* <Accordion flush>
            <Accordion.Item eventKey="0">
               <Accordion.Header>{song.title}</Accordion.Header>
               <Accordion.Body>
                     <p className="song-artist">{song.artist}</p>
                     <p><a href={song.lyricsUrl} target="_blank" rel="noreferrer">lyrics</a>{' - '}
                     <a href={song.videoUrl} target="_blank" rel="noreferrer">video</a></p>
                     <button className="btn btn-primary edit-song" onClick={() => setEditStatus(true)}>edit</button>
                     <button className="btn btn-primary delete-song">delete</button>
               </Accordion.Body>
            </Accordion.Item>
         </Accordion> */}

         <div className="song-title">
            <p onClick={() => setOpen(!open)} aria-controls="song-info" aria-expanded={open}>
               {song.title}
               {!open ? <i className="fas fa-angle-double-down fa-sm"></i> : <i className="fas fa-angle-double-up fa-sm"></i>}
            </p>
         </div>
         <Collapse in={open}>
            <div id="song-info">
               <p className="song-artist">by: {song.artist}</p>
               <p><a href={song.lyricsUrl} target="_blank" rel="noreferrer">lyrics</a>{' - '}
                  <a href={song.videoUrl} target="_blank" rel="noreferrer">video</a></p>
               <button className="btn btn-primary edit-song" onClick={() => setEditStatus(true)}>edit</button>
               <button className="btn btn-primary delete-song">delete</button>
            </div>
         </Collapse>
      </div>
   );
};

export default Song;