import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SONG } from '../../utils/mutations';
import Accordion from "react-bootstrap/Accordion";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import EasyEdit from 'react-easy-edit';

const Song = ({ song }) => {
   
   const [editStatus, setEditStatus] = useState(false);

   const [updateSong, {data}] = useMutation(UPDATE_SONG);

   const save = (value) => {updateSong({
      variables: { ...data, songs: {artist: value}}
   })}
   const cancel = () => {}

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

         <Accordion flush>
            <Accordion.Item eventKey="0">
               <Accordion.Header>{song.title}</Accordion.Header>
               <Accordion.Body>
                     <Row>
                        <Col>
                           <p>{song.artist}</p>
                        </Col>
                        <Col>
                           <i className="far fa-edit edit-song" onClick={() => setEditStatus(true)}></i>
                        </Col>
                        <Col><i class="fas fa-trash-alt delete-song"></i></Col>
                     </Row>
                     <p><a href={song.lyricsUrl} target="_blank" rel="noreferrer">lyrics</a>{' - '}
                     <a href={song.videoUrl} target="_blank" rel="noreferrer">video</a></p>
                     
               </Accordion.Body>
            </Accordion.Item>
         </Accordion>

      </div>
   );
};

export default Song;

{
  /* <EasyEdit
                        type="text"
                        value={song.artist}
                        onSave={save}
                        onCancel={cancel}
                        saveButtonLabel="Save Me"
                        cancelButtonLabel="Cancel Me"
                        attributes={{ name: "song-title", id: 1}}
                     /> */
}