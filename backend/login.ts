import express from 'express';
import querystring from 'querystring';
import * as dotenv from 'dotenv';

const client_id: string = process.env.CLIENT_ID || '';
const redirect_uri: string = 'http://localhost:8888/callback';

const app = express();

app.get('/login', (req, res) => {
    const state: string = generateRandomString(16);
    const scope: string = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });

function generateRandomString(arg0: number): string {
    return [...crypto.getRandomValues(new Uint8Array(length))]
    .map((x) => (x % 36).toString(36))
    .join("");
}
