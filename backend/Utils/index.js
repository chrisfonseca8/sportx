import Joi from 'joi';
import { match_statusEnums } from './Enums.js';

const createMatchSchema = Joi.object({
    HomeTeam: Joi.string().max(100).required().min(3),
    AwayTeam: Joi.string().max(100).required().min(3),
    Sport: Joi.string().max(100).required().min(3),
    StartTime: Joi.date().iso().required()
});

const createCommentarySchema = Joi.object({
    actor: Joi.string().max(100).required(),
    message: Joi.string().max(1000).required(),
    minute: Joi.number().integer().min(0).max(150).required(),
    sequenceNo: Joi.number().integer().min(1).required(),
    details: Joi.object().optional()
});

const min_limit = 3;
const max_limit = 100;
const match_duration = 90;

export {
    match_statusEnums,
    createMatchSchema,
    createCommentarySchema,
    min_limit,
    max_limit,
    match_duration
};
