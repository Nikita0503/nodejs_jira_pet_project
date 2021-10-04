const Router = require('express');
const router = new Router();
const userRouter = require('./user/userRouter');

router.use('/user', userRouter)
//router.use('/project')
//router.use('/task')
//router.use('/status')
//router.use('/type')
//router.use('/comment')
//router.use('/file')

module.exports = router;