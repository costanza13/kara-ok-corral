import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import EmbeddedVideo from '../components/EmbeddedVideo';
import Auth from '../utils/auth';

const PublicProfile = props => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const [addFriend] = useMutation(ADD_FRIEND, {
    update(cache, { data: { addFriend } }) {
      cache.modify({
        fields: {
          me(existingMeData) {
            return addFriend
          }
        }
      })
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  const user = data.user;

  const handleClick = async (addUsername) => {
    if (addUsername !== Auth.getProfile().data.username) {
      try {
        await addFriend({
          variables: { username: addUsername }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const showLatestPerformance = (performances) => {
    if (performances.length) {
      const { title, url } = performances[0];
      return <EmbeddedVideo title={title} artist={user.username} url={url} />
    }
  }

  const publicSongCount = user.playlists.reduce((total, playlist) => {
    return total + playlist.songs.length;
  }, 0);

  console.log('PP USER', user);

  return (
    <Container className='public-profile'>
      <Row className="pub-header">
        <Col xs={12}>
          <h2 className="pub-name">
            <span>
              <i className="fas fa-hat-cowboy fa-sm pub-user-icon"></i>
            </span>
            {userParam ? `${user.username}'s` : "your"} profile
            <button
              className="btn ml-auto"
              onClick={() => handleClick(user.username)}
            >
              <span className="pub-add-friend-btn">
                <i className="fas fa-user-plus fa-sm"></i>
              </span>
            </button>
          </h2>
        </Col>
      </Row>
      <Row>
        <Col className="pub-friends">
          <div className="friend-count">
            <h3>{user.username} has ... </h3>
            <Row>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.friendCount}{" "}
                </span>{" "}
                <br></br>
                {user.friendCount === 1 ? "friend" : "friends"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.playlistCount}{" "}
                </span>
                <br></br>
                {user.playlistsCount === 1
                  ? "public playlist"
                  : "public playlists"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {publicSongCount}{" "}
                </span>
                <br></br>
                {publicSongCount === 1
                  ? "song in public playlists"
                  : "songs in public playlists"}
              </Col>
              <Col xs={6} md={3}>
                <span className="stats-number pub-stats">
                  {user.performanceCount}{" "}
                </span>
                <br></br>
                {user.performanceCount === 1
                  ? "public performance"
                  : "public performances"}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4}>
                <div className="pub-play-list">
                  {
                    user.playlists.length ?
                      (
                        <>
                          <p className="publist-header">{user.username}<br />created these playlists:</p>
                          {user.playlists.map((playlist) => {
                            return (
                              <p className="pub-li" key={"li" + playlist._id}>
                                <Link
                                  key={playlist._id}
                                  to={`/playlist/${playlist._id}`}
                                >
                                  {playlist.name}
                                </Link>
                              </p>
                            );
                          }
                          )
                          }
                        </>
                      ) : (
                        <>
                          <p className="publist-header">
                            {user.username}<br />has no playlists!
                          </p>
                          <p className="pub-li no-info">nothing to see here</p>
                        </>
                      )
                  }
                </div>
              </Col>
              {user.partyPlaylists.length ? (
                <Col xs={12} md={4}>
                  <div className="pub-play-list">
                    <p className="publist-header">
                      {user.username}<br />is in these parties:
                    </p>
                    {user.partyPlaylists.map((playlist) => {
                      return (
                        <p className="pub-li" key={"li" + playlist._id}>
                          <Link
                            key={playlist._id}
                            to={`/party/${playlist._id}`}
                          >
                            {playlist.name}
                          </Link>
                        </p>
                      );
                    })}
                  </div>
                </Col>
              ) : (
                <Col xs={12} md={4}>
                  <div className="pub-play-list">
                    <p className="publist-header">
                      {user.username}<br />is not yet in a party
                    </p>
                    <p className="pub-li no-info">invite them to party!</p>
                  </div>
                </Col>
              )}
              {user.performances.length ? (
                <Col xs={12} md={4}>
                  <div className="pub-play-list">
                    <p className="publist-header">
                      {user.username}'s<br />latest performances
                    </p>
                    {user.performances.map((performance) => {
                      return (
                        <p className="pub-li" key={"li" + performance._id}>
                          <Link
                            key={performance._id}
                            to={`/performance/${performance._id}`}
                          >
                            {performance.song.title}
                          </Link>
                        </p>
                      );
                    })}
                  </div>
                </Col>
              ) : (
                <Col xs={12} md={4}>
                  <div className="pub-play-list">
                    <p className="publist-header">
                      {user.username}<br />no performances yet
                    </p>
                    <p className="pub-li no-info">stay tuned!</p>
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              <Col>
                <div className="performance-video">
                  {showLatestPerformance(user.performances)}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicProfile;