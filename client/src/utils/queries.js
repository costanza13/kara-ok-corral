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
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      username
      email
      friends {
        username
      }
      friendCount
      playlists {
        _id
        name
        visibility
      }
    }
  }
`;

export const QUERY_STATS = gql`
  query stats {
    SiteStats
  }
`;