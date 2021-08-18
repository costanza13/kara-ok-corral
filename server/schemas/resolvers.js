// const { AuthenticationError } = require('apollo-server-express');
const { User, Playlist, Song, Party } = require('../models');
// const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

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
        partyCount: 8
      };
    },
    playlist: async (parent, { _id }) => {
      return {
        name: 'A Playlist',
        username: 'costanza',
        createdAt: '2021-08-17 00:17:48',
        visibility: 'private',
        songs: [
          {
            _id: 123456,
            title: 'Roxanne',
            artist: 'The Police',
            lyricsUrl: 'https://genius.com/The-police-roxanne-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=RKACuaeXmQ0',
            createdAt: '2021-08-17 00:17:48',
            username: "costanza"
          }
        ]
      }
    },
    party: async (parent, { _id }) => {
      return {
        name: "Pool Party!",
        username: "costanza",
        createdAt: '2021-08-17 00:17:48',
        members: [],
        playlist: {
          name: 'A Playlist',
          username: 'costanza',
          createdAt: '2021-08-17 00:17:48',
          visibility: 'private',
          songs: [
            {
              _id: 123456,
              title: 'Roxanne',
              artist: 'The Police',
              lyricsUrl: 'https://genius.com/The-police-roxanne-lyrics',
              videoUrl: 'https://www.youtube.com/watch?v=RKACuaeXmQ0',
              createdAt: '2021-08-17 00:17:48',
              username: "costanza"
            }
          ]
        }
      };
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      // const token = signToken(user);
const token = "FAKE_TOKEN";
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

      // const token = signToken(user);
      const token = "FAKE_TOKEN";
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
        const updatedPlaylist = !playlistId ?
          await Playlist.create({ ...playlist, username: context.user.username }) :
          await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { ...playlist, username: context.user.username },
            { new: true }
          );

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { playlists: updatedPlaylist._id } },
          { new: true }
        );

        return updatedPlaylist;
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
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in to manage playlists!');
    },
    updateSong: async (parent, { playlistId, songId, song }, context) => {
      if (context.user) {
        const updatedSong = !songId ?
          await Song.create({ ...song }) :
          await Song.findOneAndUpdate(
            { _id: songId },
            { ...song },
            { new: true }
          );

        const updatedPlaylist = !songId ?
          await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $push: { songs: updatedSong._id } },
            { new: true }
          ) :
          await Playlist.findOne({ _id: playlistId });

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to add reactions!');
    },
    removeSong: async (parent, { playlistId, songId }, context) => {
      if (context.user) {
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          { _id: playlistId },
          { $pull: { songs: songId } },
          { new: true }
        );

        return updatedPlaylist;
      }

      throw new AuthenticationError('You need to be logged in to add reactions!');
    },
    updateParty: async (parent, { partyId, party }) => {
      const updatedParty = await Party.findOne({ _id: partyId });
      return updatedParty;
    },
    removeParty: async(parent, { partyId }) => {
      return {};
    }
  }
};

module.exports = resolvers;
