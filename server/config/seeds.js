const db = require('./connection');
const { User, Playlist, Song } = require('../models');

db.once('open', async () => {
    const songSeeds = [

        {
            username: 'costanza13',
            title: 'Friends in Low Places',
            artist: 'Garth Brooks',
            lyricsUrl: 'https://genius.com/Garth-brooks-friends-in-low-places-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=wDzfoQIa_ZY',
        },

        {
            username: 'costanza13',
            title: 'The Thunder Rolls',
            artist: 'Garth Brooks',
            lyricsUrl: 'https://genius.com/Garth-brooks-the-thunder-rolls-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=tdsJI8Wc2D4',
        },

        {
            username: 'costanza13',
            title: 'Two Pina Coladas',
            artist: 'Garth Brooks',
            lyricsUrl: 'https://genius.com/Garth-brooks-two-pina-coladas-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=gBhP4Ko4qZQ',
        },

        {
            username: 'crossigarcia',
            title: 'Love of Your Life',
            artist: 'RAYE',
            lyricsUrl: 'https://genius.com/Raye-love-of-your-life-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=2VMjhGw9gjs',
        },

        {
            username: 'crossigarcia',
            title: 'Girls Just Want to Have Fun',
            artist: 'Cindi Lauper',
            lyricsUrl: 'https://genius.com/Cyndi-lauper-girls-just-want-to-have-fun-lyrics',
            videoUrl: 'https://www.youtube.com/watch?v=sV9gJej7DbI',
        },

        {
            username: 'ciyer87',
            title: 'Gali Mein Aaj Chand Nikla',
            artist: 'Alka Yagnik',
            lyricsUrl: 'https://www.glamsham.com/music/lyrics/song-lyrics-gali-mein-aaj-chaand-nikla-of-zakhm',
            videoUrl: 'https://www.youtube.com/watch?v=9mZugcDsM4Y',
        }
    ];

    await Song.deleteMany();
    const songs = await Song.insertMany(songSeeds);

    const playlistSeeds = [
        {
            name: 'Best of Garth Brooks',
            username: 'costanza13',
            members: ['cupcakesprinkle3', 'crossigarcia'],
            visibility: 'private',
            songs: [songs[0]._id, songs[1]._id, songs[2]._id]
        },

        {
            name: 'Girl Power',
            username: 'crossigarcia',
            members: ['cupcakesprinkle3'],
            visibility: 'public',
            songs: [songs[3]._id, songs[4]._id]
        },

        {
            name: 'Bollywood Classics',
            username: 'ciyer87',
            members: [],
            visibility: 'private',
            songs: [songs[5]._id]
        }

    ];

    await Playlist.deleteMany();
    const playlists = await Playlist.insertMany(playlistSeeds);

    const userSeeds = [
        {
            username: 'costanza13',
            email: 'costanza13@test.com',
            password: 'password123',
            displayName: 'Michael',
            playlists: [playlists[0]._id],
            friends: [],
        },

        {
            username: 'cupcakesprinkle3',
            email: 'cupcakesprinkle3@test.com',
            password: 'password123',
            displayName: 'Michelle',
            playlists: [],
            friends: [],
        },

        {
            username: 'crossigarcia',
            email: 'crossigarcia@test.com',
            password: 'password123',
            displayName: 'Cecilia',
            playlists: [playlists[1]._id],
            friends: [],
        },

        {
            username: 'renusushmak',
            email: 'renusushmak@test.com',
            password: 'password123',
            displayName: 'Sushma',
            playlists: [],
            friends: [],
        },

        {
            username: 'ciyer87',
            email: 'ciyer87@test.com',
            password: 'password123',
            displayName: 'Chitra',
            playlists: [playlists[2]._id],
            friends: [],
        },

        {
            username: 'prince',
            email: 'prince@test.com',
            password: 'password123',
            displayName: 'Prince',
            playlists: [],
            friends: [],
        },

        {
            username: 'madonna',
            email: 'madonna@test.com',
            password: 'password123',
            displayName: 'Madonna',
            playlists: [],
            friends: [],
        },
    ];

    await User.deleteMany();
    for (let i = 0; i < userSeeds.length; i++) {
        const newUser = await User.create(userSeeds[i]);
    }

    const users = await User.find();
    const costanza13Friends = users.filter(user => user.username !== 'costanza13');
    const crossigarciaFriends = users.filter(user => user.username !== 'crossigarcia');

    await User.updateOne({ username: 'costanza13' }, { friends: [...costanza13Friends] });
    await User.updateOne({ username: 'crossigarcia' }, { friends: [...crossigarciaFriends] });

    console.log('success!');

    process.exit();
});
