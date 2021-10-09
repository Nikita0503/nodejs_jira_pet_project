const Router = require('express');
const router = new Router();
const userRouter = require('./user/userRouter');
const projectRouter = require('./project/projectRouter');
const statusRouter = require('./status/statusRouter');

router.use('/user', userRouter);
router.use('/projects', projectRouter);
router.use('/statuses', statusRouter);
//router.use('/type')
//router.use('/comment')
//router.use('/file')

module.exports = router;