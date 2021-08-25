import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import { SAVE_PLAYLIST, SAVE_SONG, DELETE_PLAYLIST, DELETE_SONG } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';
import Song from '../Song';
import PlaylistMembers from '../PlaylistMembers';
import EditableText from '../EditableText';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import './Playlist.css';


const Playlist = ({ playlistId, setVideo, updatePlaylistId }) => {
  const { loading, data: playlistData, error } = useQuery(QUERY_PLAYLIST, { variables: { playlistId } });

  const [updatePlaylist] = useMutation(SAVE_PLAYLIST, {
    update(cache, { data: { updatePlaylist } }) {
      cache.modify({
        fields: {
          playlist(existingPlaylistData) {
            return updatePlaylist
          }
        }
      })
    }
  });

  const [deletePlaylist] = useMutation(DELETE_PLAYLIST, {
    update(cache, { data: { deletePlaylist } }) {
      cache.modify({
        fields: {
          me(existingMeData) {
            return deletePlaylist
          }
        }
      })
    }
  });

  const [updateSong] = useMutation(SAVE_SONG, {
    update(cache, { data: { updateSong } }) {
      cache.modify({
        fields: {
          playlist(existingPlaylistData) {
            return updateSong
          }
        }
      })
    }
  });

  const [deleteSong] = useMutation(DELETE_SONG, {
    update(cache, { data: { deleteSong } }) {
      cache.modify({
        fields: {
          playlist(existingPlaylistData) {
            return deleteSong
          }
        }
      })
    }
  });

  useEffect(() => {
    // Update the document title using the browser API
    console.log('something updated!');
  }, [playlistData, updatePlaylist, updateSong]);

  const currentUser = Auth.loggedIn() ? Auth.getProfile().data : {};

  // if data isn't here yet, say so
  if (!playlistData && loading) {
    return (
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    console.log(error);
    if (error.message.indexOf('NOT FOUND:') > -1) {
      return (
        <div className='error'>
          <h1 className='display-2'>Not Found!</h1>
          <h2>We could not find the playlist you're looking for.</h2>
        </div>
      )
    }
    if (error.message.indexOf('FORBIDDEN:') > -1) {
      return (
        <div className='error'>
          <h1 className='display-2'>Not AUTHORIZED!</h1>
          <h2>{
            Auth.loggedIn()
              ? 'You do not have permission to view this playlist.'
              : 'You might need to be logged in to view this playlist.'
          }</h2>
        </div>
      )
    }
  }

  const playlist = !playlistId || playlistId === 'new' ? { name: '', visibility: 'private', members: [], songs: [] } : playlistData.playlist;
  console.log('playlistData', playlistData);

  const saveName = async name => {
    if (name.trim().length) {
      console.log('what the glorious crap!');
      const { visibility, members, songs } = playlist;
      const variables = { playlist: { name, visibility, members, songs } };
      if (playlist._id) {
        variables.playlistId = playlist._id;
      }
      const { data } = await updatePlaylist({ variables });
      if (data) {
        updatePlaylistId(data.updatePlaylist._id);
      }
    }
  };

  const updateMembers = async (members) => {
    const { name, visibility, songs } = playlist;
    const variables = { playlistId: playlist._id, playlist: { name, visibility, songs, members } };
    await updatePlaylist({ variables });
    const { data } = await updatePlaylist({ variables });
    if (data) {
      updatePlaylistId(data.updatePlaylist._id);
    }
  }

  const saveSong = async (songData) => {
    const { title, artist, lyricsUrl, videoUrl, performanceUrl } = songData;
    await updateSong({
      variables: { playlistId, songId: songData._id, songData: { title, artist, lyricsUrl, videoUrl, performanceUrl } }
    });
  }

  const removeSong = async (songId) => {
    await deleteSong({
      variables: { playlistId, songId }
    });
  }

  const setVisibility = async value => {
    const visibility = value === 'public' ? 'public' : 'private';
    await updatePlaylist({
      variables: { playlistId: playlist._id, playlist: { visibility } }
    });
  };

  const handleDeleteClick = async () => {
    await deletePlaylist({
      variables: { playlistId: playlist._id }
    });
    window.location.assign('/dashboard');
  };

  const isOwner = playlist.username === currentUser.username;
  const isMember = playlist.members.indexOf(currentUser.username) > -1;

  return (
    <>
      <Col xs={11} md={3}>
        <EditableText
          inputClass={"playlist-title"}
          textClass={"playlist-title"}
          blur={"save"}
          save={saveName}
        >
          {playlist.name || "Name this playlist to get started!"}
        </EditableText>
        <p className="playlist-owner">
          created by{" "}
          <Link to={`/profile/${playlist.username}`}>{playlist.username}</Link>
          {playlist.members.length ? " (and posse)" : ""}
        </p>
      </Col>
      <Col xs={1} md={{ span: 3, offset: 6 }}>
        <span className="btn delete-btn" onClick={() => handleDeleteClick()}>
          <i class="fas fa-trash-alt fa-md"></i> <span className="no-disp">delete playlist</span>
        </span>
      </Col>
      <Col xs={12} md={12}>
        {(isMember || isOwner) && !!playlist._id ? (
          <>
            <span
              className={`visibility-btn private ${playlist.visibility !== "public" ? " selected" : ""
                }`}
              onClick={() => setVisibility("private")}
            >
              {" "}
              private
            </span>
            <span
              className={`visibility-btn public ${playlist.visibility === "public" ? " selected" : ""
                }`}
              onClick={() => setVisibility("public")}
            >
              {" "}
              public
            </span>
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
          return (
            <Song
              key={song._id}
              song={song}
              canEdit={canEdit}
              saveSong={saveSong}
              setVideo={setVideo}
              deleteSong={removeSong}
            ></Song>
          );
        })}
        {(isMember || isOwner) && !!playlist._id ? (
          <Song
            key={"newsong"}
            song={null}
            canEdit={true}
            saveSong={saveSong}
          ></Song>
        ) : (
          ""
        )}
      </Col>
    </>
  );
};

export default Playlist;