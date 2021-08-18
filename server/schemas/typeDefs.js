// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type Song {
  _id: ID
  title: String
  artist: String
  lyricsUrl: String
  videoUrl: String
  createdAt: String
  username: String
}

type Playlist {
  _id: ID
  name: String
  createdAt: String
  username: String
  visibility: String
  songs: [Song]
}

type User {
  _id: ID
  username: String
  email: String
  friendCount: Int
  playlists: [Playlist]
  friends: [User]
  parties: [Party]
}

type Party {
  _id: ID
  name: String
  createdAt: String
  username: String
  members: [User]
  playlist: Playlist
}

type Auth {
  token: ID!
  user: User
}

type SiteStats {
  userCount: Int 
  songCount: Int
  performanceCount: Int
  partyCount: Int
}

input PlaylistInfo {
  name: String!
  visibility: String!
}

input SongInfo {
  title: String!
  artist: String!
  lyricsUrl: String
  videoUrl: String
  username: String!
}

input PartyInfo {
  name: String!
  username: String!
  members: [String]
  playlist: PlaylistInfo
}

type Query {
  me: User
  users: [User]
  user(username: String!): User
  stats: SiteStats
  playlist(_id: ID!): Playlist
  party(_id: ID!): Party
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  addFriend(friendId: ID!): User
  removeFriend(friend: ID!): User
  updatePlaylist(playlistId: ID, playlist: PlaylistInfo!): User
  removePlaylist(playlistId: ID!): User
  updateSong(playlistId: ID!, songId: ID, song: SongInfo!): Playlist
  removeSong(playlistId: ID!, songId: ID!): Playlist
  updateParty(partyId: ID, party: PartyInfo!): Party
  removeParty(partyId: ID!): User
}
`;

// export the typeDefs
module.exports = typeDefs;