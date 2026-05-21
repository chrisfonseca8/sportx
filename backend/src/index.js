import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from '../routes/index.js'
import { match_cron } from '../cron/cronJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", apiRoutes);

app.get('/', (req, res) => {
    res.send('working properly');
});

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
    match_cron();
});

