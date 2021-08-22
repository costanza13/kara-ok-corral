import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


const Song = ({ song, canEdit, saveSong }) => {
  const [editStatus, setEditStatus] = useState(false);

  const isAddForm = !song;
  if (isAddForm) {
    song = { title: '', artist: '', lyricsUrl: '', videoUrl: '' };
  }

  const [formState, setFormState] = useState({ ...song });

  if (isAddForm) {
    if (!editStatus) setEditStatus(true);
  }

  const viewHeaderText = song.title ? song.title : <em>add a song...</em>;
  const editHeaderText = song.title ? 'Edit Song Details' : <em>Add A Song...</em>;

  const handleChange = (e) => {
    const value = e.target.value;
    switch (e.target.id) {
      case 'songTitle':
        setFormState({ ...formState, title: value });
        break;
      case 'songArtist':
        setFormState({ ...formState, artist: value });
        break;
      case 'lyricsUrl':
        setFormState({ ...formState, lyricsUrl: value });
        break;
      case 'videoUrl':
        setFormState({ ...formState, videoUrl: value });
        break;
      default:
      // do nothing
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSong(formState);
    if (isAddForm) {
      setFormState({ title: '', artist: '', lyricsUrl: '', videoUrl: '' })
    } else {
      setEditStatus(false);
    }
  };

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
                    <input type="text" className="form-control" id="songTitle" value={formState.title} placeholder='title' onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" id="songArtist" value={formState.artist} placeholder='artist' onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <input type="url" className="form-control" id="lyricsUrl" value={formState.lyricsUrl} placeholder='lyrics URL' onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <input type="url" className="form-control" id="videoUrl" value={formState.videoUrl} placeholder='karaoke video URL' onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
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
                {
                  canEdit
                    ? <Col className="text-end">
                      <i
                        className="far fa-edit edit-song mx-1"
                        onClick={() => setEditStatus(true)}
                      ></i>
                      <i className="fas fa-trash-alt delete-song mx-1"></i>
                    </Col>
                    : ''
                }
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


