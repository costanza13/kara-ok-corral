import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse';
import './Song.css';

const Song = ({ song, canEdit, saveSong, setVideo, deleteSong }) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState({ ...song });
  const [errorMessage, setErrorMessage] = useState('');

  const isAddForm = !song.title;

  const videoDetails = { title: song.title, artist: song.artist, videoUrl: song.videoUrl };
  const launchVideo = (e) => {
    e.preventDefault();
    setVideo({ ...videoDetails });
  };

  const handleChange = (e, field) => {
    e.preventDefault();
    const value = e.target.value;
    const newState = { ...formState };
    newState[field] = value;
    setFormState(newState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.title && formState.artist) {
      saveSong(formState);
      if (isAddForm) {
        setFormState({ title: '', artist: '', lyricsUrl: '', videoUrl: '', performanceUrl: '' })
      }
      setOpen(false);
      setErrorMessage('');
    } else {
      setErrorMessage('Title and Artist are reqiured to add a song');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteSong(song._id);
  };

  const handleCancel = () => {
    setOpen(!open);
    setFormState({ ...song });
    setErrorMessage('');
  };

  const songCollapse = (
    <Row>
      <Col xs={12}>
        {
          canEdit ? (
            <span
              onClick={() => setOpen(!open)}
              aria-controls="editSong-collapse-text"
              aria-expanded={open}
              className="song-btn song-edit-btn"
            >
              {isAddForm ? <i className="far fa-plus-square"></i> : <i className="far fa-edit fa-md"></i>}
            </span>
          ) : (
            ''
          )
        }
        {song.title && song.artist ? (<p className="song-content">
          <span className="song-title">{song.title}</span>{' - '}
          <span className="song-artist">by {song.artist}</span>
        </p>) : (<p className="song-content">
          <span className="song-title italic">Add a new song...</span></p>)}
      </Col>
      <Col xs={12} md={12} lg={12}>
        {song.lyricsUrl ? (<span><a href={song.lyricsUrl} target="_blank" rel="noreferrer" className="song-btn">lyrics <i className="far fa-file-alt"></i></a></span>) : ('')}
        {song.videoUrl ? (<span><a href={song.videoUrl} onClick={(e) => launchVideo(e)} rel="noreferrer" className="song-btn">video <i title="watch" className="fas fa-desktop"></i></a></span>) : ('')}
        {song.performance && song.performance._id ? (<span><Link to={`/performance/${song.performance._id}`} className="song-btn">performance <i className="fas fa-video"></i></Link></span>) : ('')}
      </Col>
    </Row>
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
                value={{ ...formState }.videoUrl}
                placeholder="karaoke video URL"
                onChange={(e) => handleChange(e, "videoUrl")}
              />
            </div>
            <div className="mb-3">
              <em>Perform this song? Add your video here!</em>
              <input
                type="url"
                className="form-control"
                value={{ ...formState }.performanceUrl}
                placeholder="performance video URL"
                onChange={(e) => handleChange(e, "performanceUrl")}
              />
            </div>
            <Col xs={{ span: 10, offset: 2 }} md={{ span: 8, offset: 4 }}>
              <button
                type="submit"
                className="song-form-btn"
                onClick={handleSubmit}
              >
                {formState._id ? 'update' : 'add'}
              </button>
              <button type="submit" className="song-form-btn" onClick={(e) => handleDelete(e)}>
                <i className="fas fa-trash-alt fa-sm"></i>
              </button>
              <span
                onClick={handleCancel}
                aria-controls="song-collapse-text"
                aria-expanded={open}
                className="song-form-btn"
              >
                cancel
              </span>
            </Col>
          </form>
        </div>
      </Collapse>
    </>
  );

  return (
    <ListGroup>
      {song.title ? (
        <ListGroup.Item className="test">
          <Collapse in={!open} timeout={900}>{songCollapse}</Collapse>
          <Collapse in={open}>
            <Row>
              <Col xs={12} className='song-title'>Enter Song Info{errorMessage ? <>{' - '}<span className='error'>{errorMessage}</span></> : ''}</Col>
              {canEdit ? <Col xs={12}>{editCollapse}</Col> : ''}
            </Row>
          </Collapse>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item className="test">
          <Collapse in={!open} timeout={900}>{songCollapse}</Collapse>
          <Collapse in={open}>
            <Row>
              <Col xs={12} className='song-title'>Enter Song Info{errorMessage ? <>{' - '}<span className='error'>{errorMessage}</span></> : ''}</Col>
              {canEdit ? <Col xs={12}>{editCollapse}</Col> : ''}
            </Row>
          </Collapse>
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default Song;