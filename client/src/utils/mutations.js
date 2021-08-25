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
`;

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
`;

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

export const DELETE_PLAYLIST = gql`
  mutation removePlaylist($playlistId: ID!) {
    removePlaylist(playlistId: $playlistId) {
      username
      email
      friendCount
      playlists {
        _id
        name
        visibility
        members
      }
      partyPlaylists {
        _id
        name
        members
      }
      friends {
        username
      }
    }
  }
`;

export const SAVE_SONG = gql`
  mutation updateSong($playlistId: ID!, $songId: ID, $songData: SongInfo!) {
    updateSong(playlistId: $playlistId, songId: $songId, song: $songData) {
      _id
      name
      createdAt
      username
      members
      visibility
      songs {
        _id
        title
        artist
        lyricsUrl
        videoUrl
        createdAt
        username
      }
    }
  }
`;

export const DELETE_SONG = gql`
  mutation removeSong($playlistId: ID!, $songId: ID!) {
    removeSong(playlistId: $playlistId, songId: $songId) {
      _id
      name
      createdAt
      username
      members
      visibility
      songs {
        _id
        title
        artist
        lyricsUrl
        videoUrl
        createdAt
        username
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($username: String!) {
    addFriend(friendUsername: $username) {
      username
      email
      friendCount
      playlists {
        _id
        name
        visibility
        members
      }
      partyPlaylists {
        _id
        name
        members
      }
      friends {
        username
      }
    }
  } 
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($username: String!) {
    removeFriend(friendUsername: $username) {
      username
      email
      friendCount
      playlists {
        _id
        name
        visibility
        members
      }
      partyPlaylists {
        _id
        name
        members
      }
      friends {
        username        
      }
    }
  } 
`;

export const UPDATE_PERFORMANCE = gql`
  mutation updatePerformance($performanceId: ID!, $performanceInfo: PerformanceInfo!) {
    updatePerformance(performanceId: $performanceId, performanceInfo: $performanceInfo) {
      _id
      url
      username
      reactions {
        _id
        reactionBody
        username
        createdAt
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($performanceId: ID!, $reactionBody: String!) {
    addReaction(performanceId: $performanceId, reactionBody: $reactionBody) {
      _id
      url
      username
      reactions {
        _id
        username
        reactionBody
        createdAt
      }
    }
  }
`;

export const REMOVE_REACTION = gql`
  mutation removeReaction($performanceId: ID!, $reactionId: ID!) {
    removeReaction(performanceId: $performanceId, reactionId: $reactionId) {
      _id
      url
      username
      reactions {
        _id
        username
        reactionBody
        createdAt
      }
    }
  }
`;