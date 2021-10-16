const {Router} = require('express');

const {attachFileValidators,
    detachFileValidators} = require('../../middlewares/validators/fileRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const FileController = require('../../controllers/FileController');

const router = new Router();

router.post('/',
    authMiddleware,
    ...attachFileValidators(),
    FileController.attachFile);

router.delete('/:fileId',
    authMiddleware,
    ...detachFileValidators(),
    FileController.detachFile);

module.exports = router;