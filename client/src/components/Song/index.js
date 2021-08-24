import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse';
import './Song.css';

const Song = ({ song, canEdit, saveSong, setVideo }) => {
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
              <span className="song-title">{song.title}</span>{' - '}
              <span className="song-artist">by {song.artist}</span>
            </p>) : ('')}
          </Col>
          <Col xs={12} md={12} lg={{ span: 9, offset: 3 }}>
            {song.lyricsUrl ? (<span><a href={song.lyricsUrl} target="_blank" rel="noreferrer" className="song-btn">lyrics</a></span>) : ('')}
            {song.videoUrl ? (<span><a href={song.videoUrl} target="_blank" rel="noreferrer" className="song-btn">video</a></span>) : ('')}

            <span
              onClick={() => setOpen(!open)}
              aria-controls="editSong-collapse-text"
              aria-expanded={open}
              className="song-btn"
            >
              <i className="far fa-edit fa-md"></i>
            </span>
          </Col>
        </Row>
      </Collapse>
    </>
  )

  const editCollapse = (
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
            <div className="mb-3">
              <em>Perform this song? Add your video here!</em>
              <input
                type="url"
                className="form-control"
                value={formState.performanceUrl}
                placeholder="performance video URL"
                onChange={(e) => handleChange(e, "performanceUrl")}
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

  const videoDetails = { title: song.title, artist: song.artist, videoUrl: song.videoUrl };
  const launchVideo = (e) => {
    e.preventDefault();
    setVideo({ ...videoDetails });
  };

  return (
    <ListGroup>
      {song.title ? (
        <ListGroup.Item>
          <Row>
            <Col xs={12}>
              <span>{song.title}</span>&nbsp; &middot; &nbsp;<em>{song.artist}</em>
              <br></br>
              <span>
                <a href={song.lyricsUrl} target="_blank" rel="noreferrer">
                  lyrics <i className="far fa-file-alt"></i>
                </a>
              </span>
              <span className="spacer">{'//'}</span>
              <span>
                <a href={song.videoUrl} onClick={(e) => launchVideo(e)} rel="noreferrer">
                  video <i title="watch" className="fas fa-desktop"></i>
                </a>
              </span>
              {
                song.performance
                  ? <>
                    <span className="spacer">{'//'}</span>
                    <span>
                      <Link to={`/performance/${song.performance._id}`}>
                        performance <i className="fas fa-music"></i>
                      </Link>
                    </span>
                  </>
                  : ''
              }
              {
                canEdit
                  ?
                  <span
                    onClick={() => setOpen(!open)}
                    aria-controls="editSong-collapse-text"
                    aria-expanded={open}
                    className="song-btn"
                  >
                    <i className="far fa-edit fa-md"></i>
                  </span>
                  : ''
              }
            </Col>
            {canEdit ? (<Col xs={12}>{editCollapse}</Col>) : ('')}
          </Row>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item>
          <Container>
            {SongCollapse}
            {canEdit ? (<span>{editCollapse}</span>) : ("")}
          </Container>
        </ListGroup.Item>
      )
      }
    </ListGroup >
  );
};

export default Song;


