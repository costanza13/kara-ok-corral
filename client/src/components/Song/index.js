import React, { useState } from "react";
import Container from "react-bootstrap/Container";
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

  const SongCollapse = (
    <>
      <Collapse in={!open}>
            <Row>
            <Col xs={12}>
                {song.title && song.artist ? (<p className="song-content">
                  <span className="song-title">{song.title}</span>{" "}
                  <br></br>
                  <span className="song-artist">by {song.artist}</span>
                </p>) : ('')}
            </Col>
            <Col xs={12} md={12} lg={{span: 9, offset: 3}}>
                  {song.lyricsUrl ? (<span><a href={song.lyricsUrl} target="_blank" rel="noreferrer" className="song-btn">lyrics</a></span>) : ('')}
                  {song.videoUrl ? (<span><a href={song.videoUrl} target="_blank" rel="noreferrer" className="song-btn">video</a></span>) : ('')}
                
                  <span
                    onClick={() => setOpen(!open)}
                    aria-controls="editSong-collapse-text"
                    aria-expanded={open}
                    className="song-btn"
                  >
                    <i class="far fa-edit fa-md"></i>
                  </span>
            </Col>
          </Row>
          </Collapse>
    </>
  )

  const EditCollapse = (
    <>
      <Collapse in={open}>
        <div className="song-form">
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={{ ...formState }.title}
                placeholder="title"
                onChange={(e) => handleChange(e, "title")}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={{ ...formState }.artist}
                placeholder="artist"
                onChange={(e) => handleChange(e, "artist")}
              />
            </div>
            <div className="mb-3">
              <input
                type="url"
                className="form-control"
                value={{ ...formState }.lyricsUrl}
                placeholder="lyrics URL"
                onChange={(e) => handleChange(e, "lyricsUrl")}
              />
            </div>
            <div className="mb-3">
              <input
                type="url"
                className="form-control"
                value={formState.videoUrl}
                placeholder="karaoke video URL"
                onChange={(e) => handleChange(e, "videoUrl")}
              />
            </div>
            <button
              type="submit"
              className="song-btn"
              onClick={handleSubmit}
            >
              update
            </button>
            <span
              onClick={() => setOpen(!open)}
              aria-controls="song-collapse-text"
              aria-expanded={open}
              className="song-btn"
            >
              cancel
            </span>
          </form>
        </div>
      </Collapse>
    </>
  );

  return (
    <ListGroup>
        <ListGroup.Item>
          <Container>
            {SongCollapse}
            {canEdit ? (<span>{EditCollapse}</span>) : ("")}
          </Container>
        </ListGroup.Item>
    </ListGroup>
  );
};

export default Song;


