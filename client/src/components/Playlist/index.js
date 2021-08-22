import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PLAYLIST } from '../../utils/queries';
import { SAVE_PLAYLIST, SAVE_SONG } from '../../utils/mutations';
import Auth from '../../utils/auth';
import Song from '../Song';
import PlaylistMembers from '../PlaylistMembers';
import EasyEdit, { Types } from "react-easy-edit";


const Playlist = ({ playlistId }) => {
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

  const save = async value => {
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
  const cancel = value => { };

  console.log(playlistData);
  playlist = playlistId ? playlistData.playlist : { username: currentUser.username, name: 'Give us a name, eh?', visibility: 'private', members: [], songs: [] };

  const isOwner = playlist.username === currentUser.username;
  const isMember = playlist.members.indexOf(currentUser.username) > -1;

  console.log('orig playlist', playlist);

  return (
    <>
      <h2>{playlist.name}</h2>
      <EasyEdit
        type={Types.TEXT}
        value={playlist.name}
        onSave={save}
        onCancel={cancel}
        hideSaveButton={true}
        hideCancelButton={true}
        saveOnBlur={true}
        attributes={{ className: 'playlist-title' }}
      />

      <PlaylistMembers members={playlist.members} canEdit={isOwner} updateMembers={updateMembers} />
      <div className="song-list">
        {playlist.songs.map((song) => {
          const canEdit = currentUser.username === song.username;
          return <Song key={song._id} song={song} canEdit={canEdit} saveSong={saveSong}></Song>;
        })}
        {
          (isMember || isOwner) && playlistId
            ? <Song key={'newsong'} song={null} saveSong={saveSong}></Song>
            : ''
        }
      </div>
    </>
  );
};

export default Playlist;