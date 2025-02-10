import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { SpotifyAPI } from './api';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5001;
let api = new SpotifyAPI();

app.post('/api/location', async function (req: Request, res: Response) {
    try {
        let { location } = req.body;

        if (!location) {
            res.status(400).json({ error: 'Location is required' });
        }

        console.log('Received location:', location);

        // Fetch playlists from Spotify
        let playlists = await api.organize(location, api);
        const serializedPlaylists = Object.fromEntries(
            Array.from(playlists.entries()).map(([key, value]) => [JSON.stringify(key), value])
        );

        if (serializedPlaylists) {
            res.json({ success: true, playlists: serializedPlaylists });
            console.log(playlists);
        } else {
            res.status(500).json({ error: 'Failed to fetch playlists' });
        }
    } catch (error) {
        console.error('Error processing location:', error);
         res.status(500).json({ error: 'Failed to process location' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});