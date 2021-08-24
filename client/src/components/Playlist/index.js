import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import { SAVE_PLAYLIST, SAVE_SONG } from '../../utils/mutations';
import Auth from '../../utils/auth';
import Song from '../Song';
import PlaylistMembers from '../PlaylistMembers';
import EditableText from '../EditableText';
import Col from 'react-bootstrap/Col';
import './Playlist.css';


const Playlist = ({ playlistId, setVideo }) => {
  const { loading, data: playlistData } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });
  const [updatePlaylist] = useMutation(SAVE_PLAYLIST);
  const [updateSong] = useMutation(SAVE_SONG);

  const isNew = !playlistId;

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  if (loading) {
    return null;
  }

  let playlist;
  const updateMembers = async (updatedMembers) => {
    const { name, visibility } = playlist;
    const updatedPlaylist = await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { name, visibility, members: updatedMembers } }
    });

    if (isNew) {
      window.location.assign(`/playlist/${updatedPlaylist.data.updatePlaylist._id}`);
    } else {
      playlist = updatedPlaylist.data.updatePlaylist;
    }
  }

  const saveSong = async (songData) => {
    const { title, artist, lyricsUrl, videoUrl } = songData;
    const updatedPlaylist = await updateSong({
      variables: { playlistId, songId: songData._id, songData: { title, artist, lyricsUrl, videoUrl } }
    });

    playlist = updatedPlaylist.data.updatePlaylist;
  }

  const saveName = async value => {
    const { visibility, members } = playlist;
    const updatedPlaylist = await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { name: value, visibility, members } }
    });

    if (isNew) {
      window.location.assign(`/playlist/${updatedPlaylist.data.updatePlaylist._id}`);
    } else {
      playlist = updatedPlaylist.data.updatePlaylist;
    }
  };

  const setVisibility = async value => {
    const { name, members } = playlist;
    const visibility = value === 'public' ? 'public' : 'private';
    const updatedPlaylist = await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { name, visibility, members } }
    });
    playlist = updatedPlaylist.data.updatePlaylist;
  };

  console.log(playlistData);
  playlist = playlistId ? playlistData.playlist : { username: currentUser.username, name: 'Give us a name, eh?', visibility: 'private', members: [], songs: [] };

  const isOwner = playlist.username === currentUser.username;
  const isMember = playlist.members.indexOf(currentUser.username) > -1;

  console.log('orig playlist', playlist);

  return (
    <>
      <Col xs={12} md={12}>
        <EditableText
          inputClass={'playlist-title'}
          textClass={'playlist-title'}
          blur={'save'}
          save={saveName}
        >
          {playlist.name}
        </EditableText>
      </Col>
      <Col xs={12} md={12}>
        {(isMember || isOwner) && !isNew ? (
          <>
            <span className={`visibility-btn private ${playlist.visibility !== 'public' ? ' selected' : ''}`} onClick={() => setVisibility('private')}> private</span>
            <span className={`visibility-btn public ${playlist.visibility === 'public' ? ' selected' : ''}`} onClick={() => setVisibility('public')}> public</span>
          </>
        ) : (
          ""
        )}
      </Col>
      <Col xs={12} md={12} lg={3}>
        <br />
        <PlaylistMembers
          members={playlist.members}
          canEdit={isOwner}
          updateMembers={updateMembers}
        />
      </Col>
      <Col xs={12} md={12} lg={9} className="song-list">
        {playlist.songs.map((song) => {
          const canEdit = currentUser.username === song.username;
          return <Song key={song._id} song={song} canEdit={canEdit} saveSong={saveSong} setVideo={setVideo}></Song>;
        })}
        {(isMember || isOwner) && !isNew ? (
          <Song key={"newsong"} song={null} canEdit={true} saveSong={saveSong}></Song>
        ) : (
          ""
        )}
      </Col>
    </>
  );
};

export default Playlist;