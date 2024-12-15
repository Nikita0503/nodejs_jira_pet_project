const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const router = require('../routes/index');
const errorHandler = require('../middlewares/errorHandlingMiddleware');
const sequelize = require('../db');

const MAX_RETRIES = 5;
const DELAY = 1000;

const initApp = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, 'static')));
    app.use(fileUpload({}));
    app.use('/api', router);
    app.use(errorHandler);
    return app;
}

const checkDatabaseConnection = async () => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            await sequelize.authenticate();
            console.log('Database connection established.');
            return;
        } catch (error) {
            retries++;
            console.log(`Database connection failed. Retrying... (${retries}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, DELAY));
        }
    }
    throw new Error('Unable to connect to the database after several attempts.');
};

const initSequelize = async () => {
    await checkDatabaseConnection();
    await sequelize.sync();
}

module.exports = {
    initApp,
    initSequelize
};