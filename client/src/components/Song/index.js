import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


const Song = ({ song, saveSong }) => {
  const [editStatus, setEditStatus] = useState(false);

  if (!song) {
    song = { title: '', artist: '', lyricsUrl: '', videoUrl: '' }
    if (!editStatus) setEditStatus(true);
  }
  const viewHeaderText = song.title ? song.title : <em>add a song...</em>;
  const editHeaderText = song.title ? 'Edit Song Details' : <em>Add A Song...</em>;

  return (
    <div>
      {editStatus ?
        (<Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{editHeaderText}</Accordion.Header>
            <Accordion.Body>
              <div className="song-form">
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" id="songTitle" value={song.title} placeholder='title' />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" id="songArtist" value={song.artist} placeholder='artist' />
                  </div>
                  <div className="mb-3">
                    <input type="url" className="form-control" id="lyrics" value={song.lyricsUrl} placeholder='lyrics URL' />
                  </div>
                  <div className="mb-3">
                    <input type="url" className="form-control" id="youtube" value={song.videoUrl} placeholder='karaoke video URL' />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    add song
                  </button>
                </form>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>)
        :
        (<Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{viewHeaderText}</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col>
                  <p>{song.artist}</p>
                </Col>
                <Col>
                  <i
                    className="far fa-edit edit-song"
                    onClick={() => setEditStatus(true)}
                  ></i>
                </Col>
                <Col>
                  <i className="fas fa-trash-alt delete-song"></i>
                </Col>
              </Row>
              <p>
                <a href={song.lyricsUrl} target="_blank" rel="noreferrer">
                  lyrics
                </a>
                {" - "}
                <a href={song.videoUrl} target="_blank" rel="noreferrer">
                  video
                </a>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>)
      }
    </div>
  );
};

export default Song;


