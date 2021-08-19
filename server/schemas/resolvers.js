const { AuthenticationError } = require('apollo-server-express');
const { User, Playlist, Song, Party } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends')
          .populate('playlists')
          .populate('playlists.playlist.members');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('playlists')
        .populate('thoughts');
    },
    stats: async (parent) => {
      return {
        userCount: 34,
        songCount: 287,
        performanceCount: 19,
        playlistCount: 8
      };
    },
    playlist: async (parent, { _id }) => {
      return Playlist.findOne({ _id });
    },
    songs: async () => {
      const songs = await Song.find();
      return songs;
    },
    song: async (parent, { _id }) => {
      const song = await Song.findOne({ _id });
      return song;
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
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        )
          .populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to add friends!');
    },
    removeFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { friends: friendId } },
          { new: true }
        )
          .populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to add friends!');
    },
    updatePlaylist: async (parent, { playlistId, playlist }, context) => {
      if (context.user) {
        console.log(playlist);

        // turn array of members' usernames into array of user _ids
        if (playlist.members && playlist.members.length > 0) {
          const members = await User.find({ username: [...playlist.members] }, '_id');
          playlist.members = members.map(member => member._id);
          console.log(members);
        }

        const updatedPlaylist = !playlistId
          ? await Playlist.create({ ...playlist, songs: [], username: context.user.username })
          : await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { ...playlist, username: context.user.username },
            { new: true, runValidators: true }
          );

        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { playlists: updatedPlaylist._id } },
          { new: true }
        )
          .populate('playlists');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    },
    removePlaylist: async (parent, { playlistId }, context) => {
      if (context.user) {
        const deletedPlaylist = await Playlist.deleteOne({ _id: playlistId });

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
          ? await Song.create({ ...song })
          : await Song.findOneAndUpdate(
            { _id: songId },
            { ...song },
            { new: true }
          );

        // if this song wasn't already in the list (this is an add, not an update), push it onto the list
        const updatedPlaylist =
          await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $addToSet: { songs: updatedSong } },
            { new: true }
          )
            .populate('songs');

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    },
    removeSong: async (parent, { playlistId, songId }, context) => {
      if (context.user) {
        const removedSong = await Song.findOneAndDelete({ _id: songId, username: context.user.username });

        const updatedPlaylist = removedSong
          ? await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $pull: { songs: { _id: songId } } },
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
