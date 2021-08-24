import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PERFORMANCE } from '../utils/queries';
import Playlist from '../components/Playlist';
import EmbeddedVideo from '../components/EmbeddedVideo';
import Auth from '../utils/auth';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Spinner from "react-bootstrap/Spinner";

const Performance = () => {
  // const [currentVideo, setCurrentVideo] = useState(null);
  const { performanceId } = useParams();
  const { loading, error, data: performanceData } = useQuery(QUERY_PERFORMANCE, { variables: { performanceId } });

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  // if data isn't here yet, say so
  if (!performanceData && loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    if (error.toString().indexOf('NOT FOUND:') > -1) {
      return (
        <>
          <h1 className='display-2'>Not Found!</h1>
          <h2>We could not find the performance you're looking for.</h2>
        </>
      )
    }
    if (error.message.indexOf('NOT AUTHORIZED:') > -1) {
      return (
        <>
          <h1 className='display-2'>Not AUTHORIZED!</h1>
          <h2>{
            Auth.loggedIn()
              ? 'You do not have permission to view this performance.'
              : 'You might need to be logged in to view this performance.'
          }</h2>
        </>
      )
    }
  }

  console.log(performanceData);

  return (
    <div>
      Performance {performanceId}!
    </div>
  )
};

export default Performance;