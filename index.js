require('dotenv').config();
const { initApp, initSequelize } = require('./utils/init');

const PORT = process.env.PORT || 5000;

const app = initApp();

const start = async () => {
    try {
        await initSequelize();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log('Database initialization error', e)
    }
}

start();