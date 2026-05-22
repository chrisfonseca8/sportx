import express from 'express';
const router = express.Router();
import { createMatchSchema, createCommentarySchema, match_statusEnums } from '../../Utils/index.js';
import { validation } from '../../middleware/index.js';
import { match_duration } from '../../Utils/index.js';
import db from '../../models/index.js';
const { Match, Commentary } = db;
import { min_limit, max_limit } from '../../Utils/index.js';
import { where, Op } from 'sequelize';
const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;


//post route to add match in the data base 
router.post('/', validation(createMatchSchema), async (req, res) => {

    try {

        const {
            HomeTeam,
            AwayTeam,
            Sport,
            StartTime
        } = req.body;

        const response = await Match.create({
            HomeTeam,
            AwayTeam,
            Sport,
            StartTime
        });

        if (res.app.locals.broadcastMatchCreated) {
            try {
                res.app.locals.broadcastMatchCreated(response);
                console.log("res.app.locals was hit : ")

            } catch (error) {
                console.log("some error in loading res.app.locals.broadcastMatchCreated ")
            }
        }

        return res.status(201).json({
            success: true,
            data: response
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

router.post('/:matchId/commentary', validation(createCommentarySchema), async (req, res) => {
    try {
        const { matchId } = req.params;
        const match = await Match.findByPk(matchId);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        const {
            actor,
            message,
            minute,
            sequenceNo,
            details
        } = req.body;

        const response = await Commentary.create({
            matchId,
            actor,
            message,
            minute,
            sequenceNo,
            details
        });

            console.log("post req",matchId,typeof(matchId))
        if (res.app.locals.broadcastComments) {
            try {
                res.app.locals.broadcastComments(matchId,response);
                console.log("res.app.locals was hit : ")

            } catch (error) {
                console.log("some error in loading res.app.locals.broadcastMatchCreated ")
            }
        }

        return res.status(201).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/:matchId/commentary', async (req, res) => {
    try {
        const { matchId } = req.params;
        const match = await Match.findByPk(matchId);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: 'Match not found'
            });
        }

        const response = await Commentary.findAll({
            where: { matchId },
            order: [['sequenceNo', 'ASC'], ['createdAt', 'ASC']],
            limit: 10
        });

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.get('/', async (req, res) => {

    try {

        let limit = Number(req.query.limit) || min_limit;

        if (limit > max_limit) {
            limit = max_limit;
        }

        const response = await Match.findAll({

            where: {
                Status: {
                    [Op.in]: [LIVE, SCHEDULED]
                }
            },

            order: [['StartTime', 'ASC']],

            limit

        });

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

export default router