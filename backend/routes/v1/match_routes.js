import express from 'express';
const router = express.Router();
import { createMatchSchema } from '../../Utils/index.js'
import { validation } from '../../middleware/index.js'
import { match_duration } from '../../Utils/index.js'
import db from '../../models/index.js';
const { Match } = db;
import { min_limit, max_limit } from '../../Utils/index.js'
import { where } from 'sequelize';
import { match_statusEnums } from '../../Utils/index.js';
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

            // console.log(res.app.locals.broadcastMatchCreated(response));
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



import { Op } from 'sequelize';

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