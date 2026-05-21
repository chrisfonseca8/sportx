import Joi from 'joi';
import { match_statusEnums } from '../Utils/index.js';

const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;

 export const  createMatchSchema = Joi.object({

    HomeTeam: Joi.string()
        .trim()
        .required(),

    AwayTeam: Joi.string()
        .trim()
        .required(),

    Sport: Joi.string()
        .trim()
        .required(),

    StartTime: Joi.date()
        .iso()
        .required(),

    Status: Joi.string()
        .valid(LIVE, FINISHED, SCHEDULED)
        .default(SCHEDULED),

    HomeScore: Joi.number()
        .integer()
        .min(0)
        .default(0),

    AwayScore: Joi.number()
        .integer()
        .min(0)
        .default(0)

});

