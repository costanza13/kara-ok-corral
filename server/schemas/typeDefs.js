// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type Reaction {
  _id: ID
  username: String
  reactionBody: String
  createdAt: String
}

type SongMeta {
  title: String
  artist: String
}

type Performance {
  _id: ID
  url: String
  username: String
  reactions: [Reaction]
  song: SongMeta
}

type Song {
  _id: ID
  title: String
  artist: String
  lyricsUrl: String
  videoUrl: String
  createdAt: String
  username: String
  performance: Performance
}

type Playlist {
  _id: ID
  name: String
  createdAt: String
  username: String
  members: [String]
  visibility: String
  songs: [Song]
}

type PlaylistName {
  name: String
}

type User {
  _id: ID
  username: String
  email: String
  friendCount: Int
  friends: [User]
  playlistCount: Int
  playlists: [Playlist]
  partyPlaylists: [Playlist]
  performances: [Performance]
  performanceCount: Int
  songCount: Int
}

type Auth {
  token: ID!
  user: User
}

type SiteStats {
  userCount: Int 
  songCount: Int
  performanceCount: Int
  playlistCount: Int
}

input PlaylistInfo {
  name: String!
  visibility: String!
  members: [String]
}

input SongInfo {
  title: String!
  artist: String!
  lyricsUrl: String
  videoUrl: String
  performanceUrl: String
}

input PerformanceInfo {
  username: String
  url: String
  visibility: String
}

type Query {
  me: User
  users: [User]
  user(username: String!): User
  stats: SiteStats
  publicPlaylists(username: String): [Playlist]
  partyPlaylists: [Playlist]
  playlist(_id: ID!): Playlist
  songs: [Song]
  song(_id: ID!): Song
  publicPerformances(username: String): [Performance]
  performance(_id: ID!): Performance
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  addFriend(friendUsername: String!): User
  removeFriend(friendUsername: String!): User
  updatePlaylist(playlistId: ID, playlist: PlaylistInfo!): Playlist
  removePlaylist(playlistId: ID!): User
  updateSong(playlistId: ID!, songId: ID, song: SongInfo!): Playlist
  removeSong(playlistId: ID!, songId: ID!): Playlist
  updatePerformance(performanceId: ID!, performanceInfo: PerformanceInfo!): Performance
  removePerformance(performanceId: ID!): Song
  addReaction(performanceId: ID!, reactionBody: String!): Performance
  removeReaction(performanceId: ID!, reactionId: ID!): Performance
}
`;

// export the typeDefs
module.exports = typeDefs;