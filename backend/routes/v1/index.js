import express from 'express';
import matchRoutes from './match_routes.js'
const router = express.Router();

router.use('/match',matchRoutes)

export default router;