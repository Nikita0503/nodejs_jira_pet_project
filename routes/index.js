const Router = require('express');
const router = new Router();
const userRouter = require('./user/userRouter');
const projectRouter = require('./project/projectRouter');
const taskRouter = require('./task/taskRouter');

router.use('/user', userRouter);
router.use('/project', projectRouter);
router.use('/task', taskRouter)
//router.use('/status')
//router.use('/type')
//router.use('/comment')
//router.use('/file')

module.exports = router;