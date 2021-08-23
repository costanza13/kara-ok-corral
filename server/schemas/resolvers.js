const { AuthenticationError } = require('apollo-server-express');
const { User, Playlist, Song } = require('../models');
const { signToken } = require('../utils/auth');

const { ApolloError } = require('apollo-server-errors');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ username: context.user.username })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends')
          .populate('playlists');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      const userData = await User.find()
        .select('-_id')
        .populate({
          path: 'playlists',
          match: { visibility: 'public' },
          select: 'name'
        });
      return userData;
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-_id -__v -password')
        .populate('friends', 'username')
        .populate({
          path: 'playlists',
          match: { visibility: 'public' },
          select: 'name'
        });
    },
    stats: async (parent) => {
      return {
        userCount: 34,
        songCount: 287,
        performanceCount: 19,
        playlistCount: 8
      };
    },
    publicPlaylists: async (parent, { username }) => {
      const filter = { visibility: 'public' };
      if (username) {
        filter.username = username;
      }
      const playlists = await Playlist.find(filter)
        .populate('songs');
      return playlists;
    },
    partyPlaylists: async (parent, { }, context) => {
      if (context.user) {
        const playlists = await Playlist.find({ members: { $in: [context.user.username] } })
          .populate('songs');
        return playlists;
      }
      throw new AuthenticationError('Not logged in');
    },
    playlist: async (parent, { _id }, context) => {
      const playlist = await Playlist.findOne({ _id })
        .populate('songs');
      if (!playlist) {
        // not found, so return a 404
        throw new ApolloError('NOT FOUND: The requested document was not found.', 'NOT_FOUND', {});
      } else {
        const { username, visibility, members } = playlist;
        // check that the user has access
        if (visibility === 'private') {
          if (typeof context.user === 'undefined') {
            throw new ApolloError('NOT AUTHORIZED: You are not authorized to view this document.', 'NOT_AUTHORIZED', {});
          }
          if (username !== context.user.username &&
            members.indexOf(context.user.username) < 0) {
            throw new ApolloError('NOT AUTHORIZED: You are not authorized to view this document.', 'NOT_AUTHORIZED', {});
          }
        }
      }
      return playlist;
    },
    songs: async () => {
      const songs = await Song.find();
      return songs;
    },
    song: async (parent, { _id }) => {
      const song = await Song.findOne({ _id });
      return song;
    },
    publicPerformances: async(parent, { username }) => {
      return [];
    }
  },

  User: {
    partyPlaylists: async ({ username }) => {
      const playlists = await Playlist.find({ members: { $in: [username] } });
      return playlists;
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addFriend: async (parent, { friendUsername }, context) => {
      if (context.user) {
        const friend = await User.findOne({ username: friendUsername });

        const updatedUser = friend
          ? await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { friends: friend._id } },
            { new: true }
          ).populate('friends')
          : await User.findOne({ _id: context.user._id })
            .populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to add friends!');
    },
    removeFriend: async (parent, { friendUsername }, context) => {
      if (context.user) {
        const friend = await User.findOne({ username: friendUsername });
        const updatedUser = friend
          ? await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friends: friend._id } },
            { new: true }
          ).populate('friends')
          : await User.findOne({ _id: context.user._id })
            .populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to add friends!');
    },
    updatePlaylist: async (parent, { playlistId, playlist }, context) => {
      if (context.user) {
        const updatedPlaylist = !playlistId
          ? await Playlist.create({ ...playlist, songs: [], username: context.user.username })
          : await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { ...playlist, username: context.user.username },
            { new: true, runValidators: true }
          )
            .populate('songs');

        // if this is a new playlist, and it was created successfully, add it to the user's list of playlists
        if (!playlistId && updatedPlaylist) {
          const updatedUser = await User.update(
            { _id: context.user._id },
            { $addToSet: { playlists: updatedPlaylist._id } }
          )
        }

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    },
    removePlaylist: async (parent, { playlistId }, context) => {
      if (context.user) {
        const deletedPlaylist = await Playlist.deleteOne({ _id: playlistId, username: context.user.username });

        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { playlists: playlistId } },
          { new: true }
        )
          .populate('playlists');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    },
    updateSong: async (parent, { playlistId, songId, song }, context) => {
      if (context.user) {
        const updatedSong = !songId
          ? await Song.create({ ...song, username: context.user.username })
          : await Song.findOneAndUpdate(
            { _id: songId, username: context.user.username },
            { ...song },
            { new: true }
          );

        // if this song wasn't already in the list (this is an add, not an update), push it onto the list
        const updatedPlaylist =
          await Playlist.findOneAndUpdate(
            {
              _id: playlistId,
              $or: [
                { username: context.user.username },
                { members: { $in: [context.user.username] } }
              ]
            },
            { $addToSet: { songs: updatedSong._id } },
            { new: true }
          )
            .populate('songs');

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to edit songs and playlists!');
    },
    removeSong: async (parent, { playlistId, songId }, context) => {
      if (context.user) {
        const removedSong = await Song.findOneAndDelete({ _id: songId, username: context.user.username });

        const updatedPlaylist = removedSong
          ? await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $pull: { songs: songId } },
            { new: true }
          )
            .populate('songs')
          : null;

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    }
  }
};

module.exports = resolvers;
