const db = require('./connection');
const { User, Playlist, Song } = require('../models');

db.once('open', async () => {
  const songSeeds = [
    {
      username: 'costanza',
      title: 'Friends in Low Places',
      artist: 'Garth Brooks',
      lyricsUrl: 'https://genius.com/Garth-brooks-friends-in-low-places-lyrics',
      videoUrl: 'https://www.youtube.com/watch?v=wDzfoQIa_ZY'
    },
    {
      username: 'someotheruser',
      title: 'Roxanne',
      artist: 'The Police',
      lyricsUrl: 'https://genius.com/The-police-roxanne-lyrics',
      videoUrl: 'https://www.youtube.com/watch?v=RKACuaeXmQ0'
    }
  ];

  await Song.deleteMany();
  const songs = await Song.insertMany(songSeeds);

  const playlistSeeds = [
    {
      name: 'Groovy Party List',
      username: 'costanza',
      members: ['someotheruser'],
      songs: [songs[0]._id, songs[1]._id],
      visibility: 'private'
    },
    {
      name: 'Super Fun List',
      username: 'someotheruser',
      members: [],
      songs: [songs[0]._id],
      visibility: 'private'
    }
  ];

  await Playlist.deleteMany();
  const playlists = await Playlist.insertMany(playlistSeeds);

  const userSeeds = [
    {
      playlists: [playlists[1]._id],
      friends: [],
      username: 'someotheruser',
      email: 'someotheruser@test.com',
      password: 'password123',
    },
    {
      playlists: [],
      friends: [],
      username: 'cupcakesprinkle3',
      email: 'cupcakesprinkle3@test.com',
      password: 'password123',
    },
    {
      playlists: [],
      friends: [],
      username: 'cecilia',
      email: 'cecilia@test.com',
      password: 'password123',
    },
    {
      playlists: [],
      friends: [],
      username: 'chitra',
      email: 'chitra@test.com',
      password: 'password123',
    },
    {
      playlists: [],
      friends: [],
      username: 'sushma',
      email: 'sushma@test.com',
      password: 'password123',
    },
    {
      playlists: [playlists[0]._id],
      friends: [],
      username: 'costanza',
      email: 'costanza@test.com',
      password: 'password123',
    }
  ];

  await User.deleteMany();
  for (let i = 0; i < userSeeds.length; i++) {
    const newUser = await User.create(userSeeds[i]);
  }

  const users = await User.find();
  const costanzaFriends = users.filter(user => user.username !== 'costanza');
  const cupcakesprinkle3Friends = users.filter(user => user.username !== 'cupcakesprinkle3');

  await User.updateOne({ username: 'costanza' }, { friends: [...costanzaFriends] });
  await User.updateOne({ username: 'cupcakesprinkle3' }, { friends: [...cupcakesprinkle3Friends] });

  process.exit();
});