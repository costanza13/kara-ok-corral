import { gql } from '@apollo/client';

export const QUERY_PLAYLISTS = gql`
  query playlists($username: String) {
    playlists(username: $username) {
      _id
      name
      createdAt
      username
      members {
          username
      }
      songs {
        _id
        createdAt
        username
        title
        artist
        lyricsUrl
        videoUrl
        performance
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
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

export const QUERY_PLAYLIST = gql`
  query getPlaylist($playlistId: ID!) {
    playlist(_id: $playlistId) {
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
        performance {
          _id
        }
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      username
      createdAt
      email
      friendCount
      friends {
        username
      }
      playlistCount
      playlists {
        _id
        name
      }
      performanceCount
      performances {
        _id
      }
      songCount
    }
  }
`;

export const QUERY_USERS = gql`
  query getUsers {
  users {  
    username  
  }
 }
 `;
export const QUERY_STATS = gql`
  query getStats {
  stats {
    userCount
    performanceCount
    playlistCount
    songCount
  }
}
`;

export const QUERY_PERFORMANCE = gql`
  query getPerformance($performanceId: ID!) {
    performance(_id: $performanceId) {
      _id
      url
      username
      reactions {
        _id
        username
        reactionBody
        createdAt
      }
      song {
        title
        artist
      }
    }
  }
`;