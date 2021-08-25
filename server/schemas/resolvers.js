const {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} = require("apollo-server-express");
const { User, Playlist, Song, Performance } = require("../models");
const { signToken } = require("../utils/auth");

const { ApolloError } = require("apollo-server-errors");

const resolvers = {
  Query: {
    // query a user by username
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .select('-_id -__v -password -email')
        .populate('friends', 'username')
        .populate({
          path: 'playlists',
          match: { visibility: 'public' },
          select: '_id name'
        });
      return user;
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ username: context.user.username })
          .select("-__v -password")
          .populate("friends")
          .populate("playlists");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      const userData = await User.find()
        .select("-_id")
        .populate({
          path: "playlists",
          match: { visibility: "public" },
          select: "name",
        });
      return userData;
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .select("-_id -__v -password")
        .populate("friends", "username")
        .populate({
          path: "playlists",
          match: { visibility: "public" },
          select: "_id name",
        });
      return user;
    },
    stats: async (parent) => {
      return {
        userCount: await User.countDocuments(),
        songCount: await Song.countDocuments(),
        performanceCount: await Performance.countDocuments(),
        playlistCount: await Playlist.countDocuments(),
      };
    },
    publicPlaylists: async (parent, { username }) => {
      const filter = { visibility: "public" };
      if (username) {
        filter.username = username;
      }
      const playlists = await Playlist.find(filter).populate({
        path: "songs",
        populate: {
          path: "performance",
        },
      });
      return playlists;
    },
    partyPlaylists: async (parent, { }, context) => {
      if (context.user) {
        const playlists = await Playlist.find({
          members: { $in: [context.user.username] },
        }).populate({
          path: "songs",
          populate: {
            path: "performance",
          },
        });
        return playlists;
      }
      throw new AuthenticationError("Not logged in");
    },
    playlist: async (parent, { _id }, context) => {
      try {
        const playlist = await Playlist.findOne({ _id }).populate({
          path: "songs",
          populate: {
            path: "performance",
          },
        });
        if (!playlist) {
          throw new UserInputError(
            "NOT FOUND: The requested playlist was not found."
          );
        } else {
          const { username, visibility, members } = playlist;
          // check that the user has access
          if (visibility === "private") {
            if (typeof context.user === "undefined") {
              throw new ForbiddenError(
                "FORBIDDEN: You are not authorized to view this document."
              );
            }
            if (
              username !== context.user.username &&
              members.indexOf(context.user.username) < 0
            ) {
              throw new ForbiddenError(
                "FORBIDDEN: You are not authorized to view this document."
              );
            }
          }
        }
        return playlist;
      } catch (error) {
        throw new UserInputError(
          "NOT FOUND: The requested playlist was not found."
        );
      }
    },
    songs: async () => {
      const songs = await Song.find();
      return songs;
    },
    song: async (parent, { _id }) => {
      const song = await Song.findOne({ _id });
      return song;
    },
    publicPerformances: async (parent, { username }) => {
      const userFilter = username ? { username } : {};
      const performances = await Performance.find({
        ...userFilter,
        visibility: "public",
      })
        .sort("-createAt")
        .populate("reactions")
        .limit(10);
      return performances;
    },
    performance: async (parent, { _id }, context) => {
      try {
        const performance = await Performance.findOne({ _id }).populate(
          "song",
          "title artist -_id"
        );

        if (performance) {
          if (
            performance.visibility === "public" ||
            (context.user && performance.username === context.user.username)
          ) {
            return performance;
          } else if (performance.visibility === "friends") {
            if (context.user) {
              // get the owner's friend list and see if the current logged in user is a friend
              const performer = await User.findOne({
                username: performance.username,
                friends: { $in: [context.user._id] },
              });
              if (performer) {
                return performance;
              }
            }
          }
          throw new UserInputError(
            "NOT FOUND: The requested performance was not found."
          );
        }
        throw new ForbiddenError(
          "FORBIDDEN: You are not authorized to view this document."
        );
      } catch (error) {
        throw new UserInputError(
          "NOT FOUND: The requested performance was not found."
        );
      }
    },
  },

  User: {
    partyPlaylists: async ({ username }, context) => {
      const filter = { members: { $in: [username] } };
      if (!context.user) {
        filter.visibility = "public";
      }
      return await Playlist.find(filter);
    },
    performances: async ({ username }) => {
      return await Performance.find(
        { username, visibility: "public" },
        "_id url"
      )
        .populate("song")
        .sort("-createAt")
        .limit(1);
    },
    performanceCount: async ({ username }) => {
      return await Performance.countDocuments({ username });
    },
    songCount: async ({ username }) => {
      return await Song.countDocuments({ username });
    },
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
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
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
          )
            .populate("friends")
            .populate("playlists")
          : await User.findOne({ _id: context.user._id })
            .populate("friends")
            .populate("playlists");

        return updatedUser;
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to add friends!"
      );
    },
    removeFriend: async (parent, { friendUsername }, context) => {
      if (context.user) {
        const friend = await User.findOne({ username: friendUsername });
        const updatedUser = friend
          ? await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friends: friend._id } },
            { new: true }
          )
            .populate("friends")
            .populate("playlists")
          : await User.findOne({ _id: context.user._id })
            .populate("friends")
            .populate("playlists");

        return updatedUser;
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage friends!"
      );
    },
    updatePlaylist: async (parent, { playlistId, playlist }, context) => {
      if (context.user) {
        const updatedPlaylist = !playlistId
          ? await Playlist.create({
            ...playlist,
            songs: [],
            username: context.user.username,
          })
          : await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { ...playlist, username: context.user.username },
            { new: true, runValidators: true }
          )
            .populate("songs")
            .populate("songs.song.performance");

        // if this is a new playlist, and it was created successfully, add it to the user's list of playlists
        if (updatedPlaylist) {
          if (!playlistId) {
            const updatedUser = await User.update(
              { _id: context.user._id },
              { $addToSet: { playlists: updatedPlaylist._id } }
            );
          }
          return updatedPlaylist;
        }

        throw new UserInputError(
          "NOT FOUND: The requested playlist was not found."
        );
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage playlists!"
      );
    },
    removePlaylist: async (parent, { playlistId }, context) => {
      if (context.user) {
        const deletedPlaylist = await Playlist.deleteOne({
          _id: playlistId,
          username: context.user.username,
        });

        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { playlists: playlistId } },
          { new: true }
        ).populate("playlists");

        return updatedUser;
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage playlists!"
      );
    },
    updateSong: async (parent, { playlistId, songId, song }, context) => {
      if (context.user) {
        const { title, artist, videoUrl, lyricsUrl, performanceUrl } = song;

        let newPerf;
        if (performanceUrl) {
          console.log("1", song);
          // check if the song already has a performance
          const songToUpdate = songId
            ? await Song.findOne({
              _id: songId,
              username: context.user.username,
            })
            : null;

          // if the song already exists, check if it has a performance
          if (songToUpdate && songToUpdate.performance) {
            console.log("2", songToUpdate);
            // if so, update the url
            const updatedPerformance = await Performance.updateOne(
              {
                _id: songToUpdate.performance,
                username: context.user.username,
              },
              { url: performanceUrl }
            );
            console.log("2b", updatedPerformance);
          } else {
            // otherwise, create the performance
            newPerf = await Performance.create({
              url: performanceUrl,
              username: context.user.username,
              visibility: "private",
            });
          }
        }
        console.log("3", newPerf);

        const songUpdate = { title, artist, videoUrl, lyricsUrl };
        // if a new performance was added, include it in the song update
        if (newPerf) songUpdate.performance = newPerf._id;

        const updatedSong = !songId
          ? await Song.create({
            ...songUpdate,
            username: context.user.username,
          })
          : await Song.findOneAndUpdate(
            { _id: songId, username: context.user.username },
            songUpdate,
            { new: true }
          );

        console.log("4", updatedSong);
        // finally, update the performance with the song
        await Performance.updateOne(
          { _id: updatedSong.performance, username: context.user.username },
          { song: updatedSong._id }
        );

        // if this song wasn't already in the list (this is an add, not an update), push it onto the list
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          {
            _id: playlistId,
            $or: [
              { username: context.user.username },
              { members: { $in: [context.user.username] } },
            ],
          },
          { $addToSet: { songs: updatedSong._id } },
          { new: true }
        ).populate({
          path: "songs",
          populate: {
            path: "performance",
          },
        });

        return updatedPlaylist;
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to edit songs and playlists!"
      );
    },
    removeSong: async (parent, { playlistId, songId }, context) => {
      if (context.user) {
        const removedSong = await Song.findOneAndDelete({
          _id: songId,
          username: context.user.username,
        });

        // remove any associated performance
        if (removedSong) {
          Performance.deleteOne({ song: songId });
        }

        const updatedPlaylist = removedSong
          ? await Playlist.findOneAndUpdate(
            { _id: playlistId },
            { $pull: { songs: songId } },
            { new: true }
          ).populate({
            path: "songs",
            populate: {
              path: "performance",
            },
          })
          : null;

        return updatedPlaylist;
      }

      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage playlists!"
      );
    },
    updatePerformance: async (
      parent,
      { performanceId, performanceInfo },
      context
    ) => {
      if (context.user) {
        if (performanceInfo.url && performanceInfo.url.trim() === "") {
          throw new UserInputError(
            "BAD REQUEST: Performance URL cannot be blank."
          );
        }
        const performance = await Performance.findOneAndUpdate(
          { _id: performanceId, username: context.user.username },
          { ...performanceInfo },
          { new: true }
        );

        if (performance) {
          return performance;
        }
        throw new UserInputError(
          "NOT FOUND: The requested performance was not found."
        );
      }
      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage performances."
      );
    },
    removePerformance: async (parent, { performanceId }, context) => {
      if (context.user) {
        const removedPerformance = await Performance.findOneAndDelete({
          _id: performanceId,
          username: context.user.username,
        });

        if (removedPerformance) {
          const updatedSong = removedPerformance
            ? await Song.findOneAndUpdate(
              { performance: performanceId },
              { performance: null },
              { new: true }
            )
            : null;

          return updatedSong;
        }
        throw new UserInputError(
          "NOT FOUND: The requested performance was not found."
        );
      }
      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage performances."
      );
    },
    addReaction: async (parent, { performanceId, reactionBody }, context) => {
      if (context.user) {
        // user can add reactions if the performance is public, if the user is the owner, or if it's shared with friends and the user is a friend
        // so first fetch the performance
        const performance = await Performance.findOne({ _id: performanceId });

        let canAdd = false;
        if (performance) {
          if (
            performance.visibility === "public" ||
            (context.user && performance.username === context.user.username)
          ) {
            canAdd = true;
          } else if (performance.visibility === "friends") {
            // get the owner's friend list and see if the current logged in user is a friend
            const performer = await User.findOne({
              username: performance.username,
              friends: { $in: [context.user._id] },
            });
            canAdd = !!performer;
          }
          if (canAdd) {
            const updatedPerformance = await Performance.findOneAndUpdate(
              { _id: performance._id },
              {
                $push: {
                  reactions: { username: context.user.username, reactionBody },
                },
              },
              { new: true, runValidators: true }
            );
            return updatedPerformance;
          }
        }
        throw new UserInputError(
          "NOT FOUND: The requested performance was not found."
        );
      }
      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to add reactions."
      );
    },
    removeReaction: async (parent, { performanceId, reactionId }, context) => {
      if (context.user) {
        console.log(reactionId);
        return await Performance.findOneAndUpdate(
          { _id: performanceId, username: context.user.username },
          { $pull: { reactions: { _id: reactionId } } },
          { new: true }
        );
      }
      throw new ForbiddenError(
        "FORBIDDEN: You must be logged in to manage reactions."
      );
    },
  },
};

module.exports = resolvers;
