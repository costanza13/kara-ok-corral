import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/button';
import Collapse from 'react-bootstrap/Collapse';

const Song = ({ song, canEdit, saveSong }) => {
  const [open, setOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);

  const isAddForm = !song;
  if (isAddForm) {
    song = { title: '', artist: '', lyricsUrl: '', videoUrl: '' };
  }

  const [formState, setFormState] = useState({ ...song });

  if (isAddForm) {
    if (!editStatus) setEditStatus(true);
  }

  const viewHeaderText = song.title ? (
    <Row>
      <Col xs={9}>
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
      <Col xs={{span: 1, offset: 1}} onClick={() => setEditStatus(true)} className="d-flex justify-content-start">
        <span className="edit-song">
          <i
            className="far fa-edit mx-1"
            onClick={() => setEditStatus(true)}
          ></i>
        </span>
      </Col>
    </Row>
  ) : (
    <em>add a song...</em>
  );
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

  function EditCollapse() {
    return (
      <>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="editSong-collapse-text"
          aria-expanded={open}
        >
          edit
        </Button>
        <Collapse
          in={open}
        >
          <div className="song-form">
            <form onKeyUp={() => setOpen(!open)}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id={song.title}
                  value={formState.title}
                  placeholder="title"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id={song.artist}
                  value={formState.artist}
                  placeholder="artist"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="url"
                  className="form-control"
                  id={song.lyricsUrl}
                  value={formState.lyricsUrl}
                  placeholder="lyrics URL"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="url"
                  className="form-control"
                  id={song.videoUrl}
                  value={formState.videoUrl}
                  placeholder="karaoke video URL"
                  onChange={handleChange}
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
    );
  }

  return (
    <ListGroup>
      <ListGroup.Item>
        {song.title ? (
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
            <Col xs={12}>
              <EditCollapse />
            </Col>
          </Row>
        ) : (
          <em>add a song...</em>
        )}
      </ListGroup.Item>
    </ListGroup>
  );
};

// {
//   canEdit ? (
//     <Col>
//       <i className="fas fa-trash-alt delete-song mx-1"></i>
//     </Col>
//   ) : (
//     ""
//   );
// }

export default Song;


