import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_PARTIES } from '../utils/queries';
import { SAVE_PLAYLIST, DELETE_PLAYLIST } from '../utils/mutations';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import EditableText from '../components/EditableText';

const Dashboard = () => {
  const [friendCount, setFriendCount] = useState(-1);
  const [show, setShowFriends] = useState(false);
  const { loading, data: userData } = useQuery(QUERY_ME);
  const { loading: loadingParties, data: friendsParties } = useQuery(QUERY_PARTIES);
  const history = useHistory();

  const [savePlaylist] = useMutation(
    SAVE_PLAYLIST,
    {
      update(cache, { data: { updatePlaylist } }) {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, playlists: [...me.playlists, updatePlaylist] } },
        });
      }
    }
  );

  const [removePlaylist] = useMutation(
    DELETE_PLAYLIST,
    {
      update(cache, { data: { removePlaylist } }) {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removePlaylist }
        });
      }
    });

  useEffect(() => {
    // not much to do -- the hooks will work their magic
  }, [userData, savePlaylist, removePlaylist]);

  const addPlaylist = async (name) => {
    const { data: { updatePlaylist: { _id: newPlaylistId } } } = await savePlaylist({ variables: { playlist: { name, visibility: 'private', members: [] } } });
    history.push(`/playlist/${newPlaylistId}`);
  };

  const deletePlaylist = (e, playlistId) => {
    e.preventDefault();
    removePlaylist({ variables: { playlistId } });
  };

  let user;

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return (
      <div className='error'>
        <h1 className='display-2'>Forbidden</h1>
        <h2>You must be logged in to see this page.</h2>
      </div>
    );
  }

  // if data isn't here yet, say so
  if (loading || loadingParties) {
    user = null;
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  user = userData.me;
  if (friendCount === -1) {
    setFriendCount(user.friendCount);
  }

  // rearrange the user's playlists to list all personal playlists together and
  // all party playlists together, regardless of who owns them
  // these don't need to be updated when a friend is add or removed
  const personalPlaylists = user.playlists.filter(playlist => playlist.members.length === 0);
  const partyPlaylists = [
    ...user.playlists.filter(playlist => playlist.members.length > 0),
    ...friendsParties.partyPlaylists
  ];

  console.log('YOU',user);
  const performanceCount = user.performanceCount;

  const handleClose = () => setShowFriends(false);
  const handleShow = () => setShowFriends(true);

  const friendsOffCanvas =
    <>
      <p className="me-2 friends-toggle" variant="primary" onClick={handleShow}>Friends: {friendCount}</p>
      <Offcanvas show={show} onHide={handleClose} placement="end" scroll={true} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>You have {friendCount} {friendCount === 1 ? 'friend' : 'friends'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FriendList friends={user.friends} friendCount={friendCount} username={user.username} setFriendCount={setFriendCount} />
        </Offcanvas.Body>
      </Offcanvas>
    </>

  return (
    <Container className="mt-4">
      <Row>
        <div className="user-info">
          <Col xs={12} md={4}>
            <h2 className="username">
              <i className="fas fa-hat-cowboy fa-sm user-icon"></i>
              {user.username}
            </h2>
          </Col>
          <Col xs={12} md={8}>
            <span className="dash-stats">
              <Link to={`/profile/${user.username}`}>public profile</Link> ||
              playlists: {user.playlists.length} || performances:{' '}
              {performanceCount} || {friendsOffCanvas}
            </span>
          </Col>
        </div>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div className="playlist-list">
            <h3 className="playlist-header">Your Playlists</h3>
            <ListGroup variant="flush">
              <ListGroup.Item key={"linew_playlist"} className="playlist-name">
                <EditableText
                  inputClass={"create-playlist"}
                  textClass={"create-playlist"}
                  blur={"hold"}
                  save={addPlaylist}
                  showSave={true}
                  showCancel={true}
                  saveButtonClass={"edit-btn"}
                  cancelButtonClass={"edit-btn"}
                  initClear={true}
                  editIcon={<i className="far fa-plus-square"></i>}
                >
                  create a new playlist
                </EditableText>
              </ListGroup.Item>
              {personalPlaylists.map((playlist) => {
                return (
                  <ListGroup.Item
                    key={"li" + playlist._id}
                    className="playlist-name"
                  >
                    <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                      {playlist.name}
                    </Link>
                    <em>&raquo;</em>
                    <span
                      onClick={(e) => deletePlaylist(e, playlist._id)}
                      className="dashboard delete-btn"
                    >
                      <i className="far fa-trash-alt fa-lg"></i>
                    </span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Col>
        <Col>
          <div className="playlist-list">
            <h3 className="playlist-header">Party Playlists</h3>
            <ListGroup variant="flush">
              {partyPlaylists.length ? (
                <>
                  {partyPlaylists.map(playlist => {
                    return (
                      <ListGroup.Item
                        key={"li" + playlist._id}
                        className="playlist-name"
                      >
                        <Link key={playlist._id} to={`/party/${playlist._id}`}>
                          {playlist.name}
                        </Link>
                        <span>
                          <i className="fas fa-glass-cheers fa-sm"></i>
                          <em>&raquo;</em>
                        </span>
                        {playlist.username === user.username ? (
                          <span
                            onClick={(e) => deletePlaylist(e, playlist._id)}
                            className="dashboard delete-btn"
                          >
                            <i className="far fa-trash-alt fa-lg"></i>
                          </span>
                        ) : (
                          ''
                        )}
                      </ListGroup.Item>
                    );
                  })}
                </>
              ) : (
                <ListGroup.Item>
                  <em>no parties yet!</em>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;