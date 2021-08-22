import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import fuzzySearch from 'fz-search';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_USER, QUERY_USERS } from '../utils/queries';
import FriendList from '../components/FriendList';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const { username: userParam } = useParams();

  const [addFriend] = useMutation(ADD_FRIEND);

  // const { loading, data: userData } = useQuery(QUERY_ME);
  const { loading, data:userData } = useQuery(QUERY_ME, QUERY_USER, {
     variables: { username: userParam }
  });
  const [value, setValue] = useState("");
  const [fuzzyValue, setFuzzyValue] = useState("");
  const { loading: queryUsersLoading, data: usersData} = useQuery(QUERY_USERS);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return (
      <div>
        <h2>You must be logged in to see this page.</h2>
        {/* do we want to include the login form here? */}
      </div>
    );
  }

  // if data isn't here yet, say so
  if (loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  console.log(userData);
  const user = userData.me;

  // rearrange the user's playlists to list all personal playlists together and
  // all party playlists together, regardless of who owns them
  const personalPlaylists = user.playlists.filter(playlist => playlist.members.length === 0);
  const partyPlaylists = [
    ...user.playlists.filter(playlist => playlist.members.length > 0),
    ...user.partyPlaylists
  ];

  function FriendsOffCanvas() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleInputOnChange = e => {
      setValue(e.target.value) 
      //console.log(usersData)
      const usernames = usersData.users.map(user => user.username)

      const searcher = new fuzzySearch({source: usersData.users, keys:["username"]});
      setFuzzyValue(searcher.search(e.target.value))
  }
  const handleClick = async (username) => {
    try {
        await addFriend({
            variables: {username}
        });
    } catch (e) {
        console.error(e);
    }
};

    return (
      <>
        <p className="me-2 friends-toggle" variant="primary" onClick={handleShow}>Friends: {user.friendCount}</p>
        <Offcanvas show={show} onHide={handleClose} placement="end" scroll={true} backdrop={false}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>You have {user.friendCount} {user.friendCount === 1 ? 'friend' : 'friends'}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <FriendList friends={user.friends} friendCount = {user.friendCount} username = {user.username}/>
            <button className="btn ml-auto" onClick={handleClick}>
                Add Friend
              </button> 
           
            <input value={value} onChange={handleInputOnChange} type="text" />
                         
              {(fuzzyValue.length > 0 && <div>
                  {fuzzyValue.map(user => <button className="btn ml-auto" onClick={() => handleClick(user.username)}>
                      {user.username}
                  </button>)} </div>
                         )}
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <div className="user-info">
          <span>
            <i className="fas fa-hat-cowboy fa-lg user-icon"></i>
          </span>
          <h2 className="username">
            {user.username}
            <br></br>
            <span className="friend-count">
              <FriendsOffCanvas />
            </span>
          </h2>
        </div>
      </Row>
      <Row xs={1} md={2}>
        <Col>
          <div className="playlist-list">
            <h3 className="playlist-header">Your Playlists</h3>
            <ListGroup variant="flush">
              <ListGroup.Item key={"linew_playlist"} className="playlist-name">
                <Link key={"new_playlist"} to={"/playlist/new"}>
                  <em>create a new playlist &raquo;</em>
                </Link>
              </ListGroup.Item>
              {personalPlaylists.map((playlist) => {
                return (
                  <ListGroup.Item key={"li" + playlist._id} className="playlist-name">
                    <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                      {playlist.name}
                    </Link>
                    <em>&raquo;</em>
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
              {partyPlaylists.map((playlist) => {
                return (
                  <ListGroup.Item key={"li" + playlist._id} className="playlist-name">
                    <Link key={playlist._id} to={`/party/${playlist._id}`}>
                      {playlist.name}
                    </Link>
                    <span>
                      <i className="fas fa-glass-cheers fa-sm"></i>
                      <em>&raquo;</em>
                    </span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;