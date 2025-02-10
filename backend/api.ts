import axios from 'axios';
import * as dotenv from 'dotenv';
import { TokenResponse } from './types';

dotenv.config();

export class SpotifyAPI {
    private clientID: string = process.env.CLIENT_ID || '';
    private clientSecret: string = process.env.CLIENT_SECRET || '';
    private tokenURL: string = 'https://accounts.spotify.com/api/token';
    private API_URL: string = 'https://api.spotify.com/v1/search';
    private token: string = '';

    constructor() {
        this.authenticate();
    }

    private async authenticate(): Promise<void> {
        const credentials = Buffer.from(`${this.clientID}:${this.clientSecret}`).toString('base64');
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        try {
            const response = await axios.post<TokenResponse>(this.tokenURL, params.toString(), {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            this.token = response.data.access_token;
            // console.log('API Key:', this.token);
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }

    public async scrapePlaylists(keywords: string): Promise<any> {
        const query = encodeURIComponent(keywords);
        const requestUrl = `${this.API_URL}?q=${query}&type=playlist`;

        try {
            const response = await axios.get(requestUrl, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return null;
        }
    }

    public async scrape(url: string): Promise<any> {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:",', error);
            return null;
        }
    }

    public async organize(args: string, api: SpotifyAPI): Promise<Map<string, number>> {
        let response = await api.scrapePlaylists(args);
    
        // Helper function to check for null values
        const isNotNull = <T extends unknown>(item: T | null): item is T => item !== null;
    
        // Filter the playlists to ensure they are not null
        let filtered = response.playlists.items.filter(isNotNull);
    
        let songs = new Map<string, number>(); // Use string as the key
    
        for (let i = 0; i < filtered.length; i++) {
            // Ensure playlist tracks are not null or undefined
            let tracklists = await api.scrape(filtered[i].tracks.href);
    
            // Check if tracklists or tracklists.items are null or undefined and continue to next iteration if so
            if (!isNotNull(tracklists) || !isNotNull(tracklists.items)) {
                console.warn(`No valid items found in playlist ${i}`);
                continue;
            }
    
            // Filter out null or invalid items
            let songlist = tracklists.items.filter((item: { track: { id: any; popularity: any; }; }) =>
                isNotNull(item.track) && isNotNull(item.track.id) && isNotNull(item.track.popularity)
            );
    
            // Process the valid songs
            songlist.forEach((item: any) => {
                if (item.track) {
                    // Use a stringified tuple as the key
                    const key = `${item.track.id},${item.track.name}`;
                    songs.set(key, item.track.popularity);
                }
            });
        }
    
        // Get top 20 of the most popular songs
        let songOrder = new Map(Array.from(songs.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20));
        return songOrder;
    }
}


// (async () => {
//     const api = new SpotifyAPI();
//     await new Promise(resolve => setTimeout(resolve, 2000)); // wait for auth?
//     const songs = await api.organize("California", api)
    
//     console.log(songs.size)
//     console.log(songs)
//   })();  