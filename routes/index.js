const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const projectRouter = require('./projectRouter');
const statusRouter = require('./statusRouter');
const typeRouter = require('./typeRouter');
const fileRouter = require('./fileRouter');

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/statuses', statusRouter);
router.use('/types', typeRouter);
router.use('/files', fileRouter);

module.exports = router;