import { gql } from '@apollo/client';

export const SAVE_PLAYLIST = gql`
  mutation updatePlaylist($playlistId: ID, $playlist: PlaylistInfo!) {
    updatePlaylist(playlistId: $playlistId, playlist: $playlist) {
      username
      playlists {
        _id
        name
        members
        visibility
        songs {
          _id
          title
          artist
        }
      }
    }
  }
`;
