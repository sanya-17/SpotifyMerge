const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
const queryString = require('query-string');
const { emitWarning } = require('process');

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
const CLIENT_ID = 'aa0cd8260d834c78850ede01794ee230';
const CLIENT_SECRET = 'fd33edad833d4654885a9bfa925be64a'
const SCOPES = 'playlist-modify-public';
const REDIRECT_URI = 'http://localhost:3000/callback'
let ACCESS_TOKEN = '';
let REFRESH_TOKEN = '';

/*
//playlist data, to reduce number of requests while developing
const playlists = [
    {
        collaborative: false,
        description: '',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/3VT8hEIEP6mJzMFAMdU63N'
        },
        href: 'https://api.spotify.com/v1/playlists/3VT8hEIEP6mJzMFAMdU63N',
        id: '3VT8hEIEP6mJzMFAMdU63N',
        images: [[Object], [Object], [Object]],
        name: 'workout ',
        owner: {
            display_name: 'Akin Akisanya',
            external_urls: [Object],
            href: 'https://api.spotify.com/v1/users/akinakisanya',
            id: 'akinakisanya',
            type: 'user',
            uri: 'spotify:user:akinakisanya'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'MzMsMGVlNDk2OTIzYmIyZWQ5MjhhYjE4MzI5MjY3OWYwNGEzYzc2NTNjZA==',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/3VT8hEIEP6mJzMFAMdU63N/tracks',
            total: 32
        },
        type: 'playlist',
        uri: 'spotify:playlist:3VT8hEIEP6mJzMFAMdU63N'
    },
    {
        collaborative: false,
        description: '',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/2W4ZIzLr7UBROYSpIH2EeY'
        },
        href: 'https://api.spotify.com/v1/playlists/2W4ZIzLr7UBROYSpIH2EeY',
        id: '2W4ZIzLr7UBROYSpIH2EeY',
        images: [[Object], [Object], [Object]],
        name: 'SyAp',
        owner: {
            display_name: 'Akin Akisanya',
            external_urls: [Object],
            href: 'https://api.spotify.com/v1/users/akinakisanya',
            id: 'akinakisanya',
            type: 'user',
            uri: 'spotify:user:akinakisanya'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'OTUsZWZmZjYzYmE5MWQyMDM2NDViZjczYzAzZTk2NjJmYmYzOGY0ZTlkMQ==',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/2W4ZIzLr7UBROYSpIH2EeY/tracks',
            total: 26
        },
        type: 'playlist',
        uri: 'spotify:playlist:2W4ZIzLr7UBROYSpIH2EeY'
    },
    {
        collaborative: false,
        description: '',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/5nW50pmptGqv3BNT7xL5J6'
        },
        href: 'https://api.spotify.com/v1/playlists/5nW50pmptGqv3BNT7xL5J6',
        id: '5nW50pmptGqv3BNT7xL5J6',
        images: [[Object], [Object], [Object]],
        name: 'afro beatz',
        owner: {
            display_name: 'Akin Akisanya',
            external_urls: [Object],
            href: 'https://api.spotify.com/v1/users/akinakisanya',
            id: 'akinakisanya',
            type: 'user',
            uri: 'spotify:user:akinakisanya'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'MTMsYWNiNTNlMDdmNWVjZWQ5OWZlM2IxZmE5YzU1Yzc1NjM5MjAyMWQ1Mg==',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/5nW50pmptGqv3BNT7xL5J6/tracks',
            total: 10
        },
        type: 'playlist',
        uri: 'spotify:playlist:5nW50pmptGqv3BNT7xL5J6'
    },
    {
        collaborative: false,
        description: '',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/2O7QGXnokRhEKRb2Onmp80'
        },
        href: 'https://api.spotify.com/v1/playlists/2O7QGXnokRhEKRb2Onmp80',
        id: '2O7QGXnokRhEKRb2Onmp80',
        images: [[Object], [Object], [Object]],
        name: 'D10',
        owner: {
            display_name: 'Diba Nwegbo',
            external_urls: [Object],
            href: 'https://api.spotify.com/v1/users/22uuauopbx6ikx6w7gbsmk3mq',
            id: '22uuauopbx6ikx6w7gbsmk3mq',
            type: 'user',
            uri: 'spotify:user:22uuauopbx6ikx6w7gbsmk3mq'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'NTEsNDMzYTc1NDQwN2JlZjFkNDU1MTEzNzgzNzZiZGI1MzFlNTIzOTdlNg==',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/2O7QGXnokRhEKRb2Onmp80/tracks',
            total: 49
        },
        type: 'playlist',
        uri: 'spotify:playlist:2O7QGXnokRhEKRb2Onmp80'
    },
    {
        collaborative: false,
        description: 'For whatever activity you do that may need a punch of intensity!',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWUVpAXiEPK8P'
        },
        href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DWUVpAXiEPK8P',
        id: '37i9dQZF1DWUVpAXiEPK8P',
        images: [[Object]],
        name: 'Power Workout',
        owner: {
            display_name: 'Spotify',
            external_urls: [Object],
            href: 'https://api.spotify.com/v1/users/spotify',
            id: 'spotify',
            type: 'user',
            uri: 'spotify:user:spotify'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'MTYwODIxNzk2OCwwMDAwMDAwMGQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0Mjdl',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DWUVpAXiEPK8P/tracks',
            total: 50
        },
        type: 'playlist',
        uri: 'spotify:playlist:37i9dQZF1DWUVpAXiEPK8P'
    }
]
*/
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI,
        }))
})

app.get('/callback', async (req, res) => {
    let code = req.query.code;


    let data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }


    try {
        const result = await axios.post('https://accounts.spotify.com/api/token', queryString.stringify(data))
        ACCESS_TOKEN = result.data.access_token;
        REFRESH_TOKEN = result.data.refresh_token;
        res.redirect('/home')
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/home', async (req, res) => {
    try {
        //TODO: Show album art and prettify the list of albums
        let playlists = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        })


        playlists = playlists.data.items;

        res.render('home', { playlists })
    }
    catch (e) {
        console.log(e);
    }
})

//TODO: Modularize
//TODO: Request refresh token if necessary
//TODO: Handle playlists with over 100 songs
//TODO: Error Handling
app.post('/new_playlist', async (req, res) => {
    const [p1, p2] = Object.values(req.body)
    const NAME = req.body.playlist_name || 'Merged Playlist';

    //call API to fetch playlist 1
    try {
        var playlist_1 = await axios.get(`https://api.spotify.com/v1/playlists/${p1}`, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            params: {
                'fields': 'name,tracks.items(track)'
            }
        });
    }
    catch (e) {
        console.log(e);
        res.redirect('/');
    }

    //call API to fetch playlist 2
    try {
        var playlist_2 = await axios.get(`https://api.spotify.com/v1/playlists/${p2}`, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            params: {
                'fields': 'name, tracks.items.track(uri,name)'
            }
        });
    }
    catch (e) {
        console.log(e);
        res.redirect('/');
    }


    playlist_1 = playlist_1.data;
    playlist_2 = playlist_2.data
    console.log(playlist_1);
    console.log(playlist_2);
    const URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1.tracks.items) {
        songs.add(item.track.uri);
    }

    //loop over playlist 2 and if the track is in playlist 1, add it to the array of URIs
    for (let item of playlist_2.tracks.items) {
        if (songs.has(item.track.uri))
            URIs.push(item.track.uri);
    }

    console.log(URIs);


    //create new playlist
    //fetch the current users id first, then create the playlist
    //axios was tweaking: https://stackoverflow.com/questions/59575400/getting-request-failed-with-status-code-401-error-when-trying-to-create-a-play
    try {
        //fetch id
        let user = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        });
        console.log(user.data);
        const { id } = user.data;
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, data, config)
    }
    catch (e) {
        console.log(e);
        res.redirect('/')
    }

    console.log("new playlist")
    console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

    try {
        const data = {
            uris: URIs
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
        res.redirect('/home')

    }
    catch (e) {
        console.log(e);
        res.redirect('/');
    }

    //TODO: Redirect to a results page

    //res.redirect('/home');
})

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})
