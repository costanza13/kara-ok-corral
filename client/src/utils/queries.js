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
        performance {
          _id
          url
        }
      }
    }
  }
`;

export const QUERY_PARTIES = gql`
  query getPartyPlaylists {
    partyPlaylists {
      _id
      name
      createdAt
      username
      members
      songs {
        title
        artist
        lyricsUrl
        videoUrl
        createdAt
        username
        performance {
          _id
          url
        }
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
        username
      }
      partyPlaylists {
        _id
        name
        members
        username
      }
      friends {
        username
      }
      performanceCount
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
          url
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
        songs {
          _id
          title
          artist
        }
      }
      partyPlaylists {
        _id
        name
      }
      performanceCount
      performances {
        _id
        url
        song {
          title
          artist
        }
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
      visibility
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