const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const router = require('../routes/index');
const errorHandler = require('../middlewares/errorHandlingMiddleware');
const sequelize = require('../db');

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

const initSequelize = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
}

module.exports = {
    initApp,
    initSequelize
};