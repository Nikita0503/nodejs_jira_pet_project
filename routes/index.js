const Router = require('express');
const router = new Router();
const userRouter = require('./user/userRouter');
const projectRouter = require('./project/projectRouter');
const statusRouter = require('./status/statusRouter');
const typeRouter = require('./type/typeRouter');
const fileRouter = require('./file/fileRouter');

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/statuses', statusRouter);
router.use('/types', typeRouter);
router.use('/files', fileRouter);

module.exports = router;