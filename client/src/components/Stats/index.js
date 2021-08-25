import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { QUERY_STATS } from '../../utils/queries';
import './Stats.css';


const Stats = props => {

  const { loading, data } = useQuery(QUERY_STATS);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div className="stats-bar">
      <h2 className="stats-h2">In the Corral <i className="fas fa-hat-cowboy"></i>
      </h2>
      <div className="stats-padding">
        <Container>
          <Row>
            <Col size="3">Total songs: <div className="stats-number">{data.stats.songCount}</div></Col>
            <Col size="3">Total singers: <div className="stats-number">{data.stats.userCount}</div></Col>
            <Col size="3">Total playlists: <div className="stats-number">{data.stats.playlistCount}</div></Col>
            <Col size="3">Total performances: <div className="stats-number">{data.stats.performanceCount}</div></Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container>
          <Row>
            <Col>
              <h2 className="stats-h2">Join Us <i className="fas fa-microphone-alt"></i>
              </h2>
              <p>You’re ready to perform your next karaoke hit and win your next karaoke battle. But with so many sing-worthy songs,<br />  sifting through options can feel like the wild-wild-west.</p>
              <p>Introducing <span className="stats-span">The Kara-OK-Corral</span>. This app lets you build personal and shared song lists, link to karaoke videos,<br /> and react to friends' performances. Now you and your posse can bring a full song arsenal to your next karaoke showdown.<br /> The Kara-OK-Corral is home to your karaoke roundup.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default Stats;