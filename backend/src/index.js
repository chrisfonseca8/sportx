import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from '../routes/index.js';
import {match_cron} from '../cron/cronJobs.js';
import http from 'http';
import { attachWebsocketServer } from './server.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('working properly');
});

const { broadcastMatchCreated } = attachWebsocketServer(server);

app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const base_url =
        HOST === '0.0.0.0'
            ? `http://localhost:${PORT}`
            : `http://${HOST}:${PORT}`;

    match_cron();
    console.log(`server is running on ${base_url}`);
    console.log(
        `WebSocketServer is running on ${base_url.replace('http', 'ws')}/ws`
    );
});