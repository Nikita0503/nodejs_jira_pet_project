const {Router} = require('express');

const {saveFileValidators,
    deleteFileValidators} = require('../../middlewares/validators/fileRouterValidators');
const authMiddleware = require('../../middlewares/authMiddleware');
const FileController = require('../../controllers/FileController');

const router = new Router();

router.post('/',
    authMiddleware,
    ...saveFileValidators(),
    FileController.saveFile);

router.delete('/:fileId',
    authMiddleware,
    ...deleteFileValidators(),
    FileController.deleteFile);

module.exports = router;