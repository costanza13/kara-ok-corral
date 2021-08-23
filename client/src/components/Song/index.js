import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/button';
import Collapse from 'react-bootstrap/Collapse';

const Song = ({ song, canEdit, saveSong }) => {
  const [open, setOpen] = useState(false);

  const isAddForm = !song;
  if (isAddForm) {
    song = { title: '', artist: '', lyricsUrl: '', videoUrl: '' };
  }

  const [formState, setFormState] = useState({ ...song });

  const handleChange = (e, field) => {
    e.preventDefault();
    const value = e.target.value;
    const newState = { ...formState };
    newState[field] = value;
    setFormState(newState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSong(formState);
    if (isAddForm) {
      setFormState({ title: '', artist: '', lyricsUrl: '', videoUrl: '' })
    } else {
      setOpen(false);
    }
  };

  const EditCollapse =
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="editSong-collapse-text"
        aria-expanded={open}
      >
        edit
      </Button>
      <Collapse in={open}>
        <div className="song-form">
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={{ ...formState }.title}
                placeholder="title"
                onChange={(e) => handleChange(e, 'title')}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={{ ...formState }.artist}
                placeholder="artist"
                onChange={(e) => handleChange(e, 'artist')}
              />
            </div>
            <div className="mb-3">
              <input
                type="url"
                className="form-control"
                value={{ ...formState }.lyricsUrl}
                placeholder="lyrics URL"
                onChange={(e) => handleChange(e, 'lyricsUrl')}
              />
            </div>
            <div className="mb-3">
              <input
                type="url"
                className="form-control"
                value={formState.videoUrl}
                placeholder="karaoke video URL"
                onChange={(e) => handleChange(e, 'videoUrl')}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              update
            </button>
          </form>
        </div>
      </Collapse>
    </>

  return (
    <ListGroup>
      {song.title ? (
        <ListGroup.Item>
          <Row>
            <Col xs={12}>
              <span>{song.title}</span> <br></br> <span>{song.artist}</span>
              <br></br>
              <span>
                <a href={song.lyricsUrl} target="_blank" rel="noreferrer">
                  lyrics
                </a>{" "}
              </span>
              //{" "}
              <span>
                <a href={song.videoUrl} target="_blank" rel="noreferrer">
                  video
                </a>
              </span>
            </Col>
            {canEdit ? (<Col xs={12}>{EditCollapse}</Col>) : ('')}
          </Row>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item>
          <em>add a song...</em>
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default Song;


