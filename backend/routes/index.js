import express from 'express';
import matchRoutes from './v1/match_routes.js';

const router = express.Router();

router.use('/v1/matches', matchRoutes);

export default router;
