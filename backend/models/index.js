'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', 'config.json'), 'utf8'))[env];

const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config);

const db = {};

const modelFiles = fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');

for (const file of modelFiles) {
    const modelPath = path.join(__dirname, file);
    const module = await import(pathToFileURL(modelPath).href);
    const modelDef = module.default;
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
