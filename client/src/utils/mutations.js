import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
               
                username
            }
        }
    }
`

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
            
                username
                email
            }
        }
    }
`    

export const SAVE_PLAYLIST = gql`
  mutation updatePlaylist($playlistId: ID, $playlist: PlaylistInfo!) {
    updatePlaylist(playlistId: $playlistId, playlist: $playlist) {
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
`;
