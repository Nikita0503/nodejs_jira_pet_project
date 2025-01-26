const {Router} = require('express');
const {getFullCommentValidators,
    getCommentsValidators, 
    createCommentValidators,
    editCommentValidators,
    deleteCommentValidators} = require('../middlewares/validators/commentRouterValidators');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRoleMiddleware = require('../middlewares/checkRoleMiddleware');
const CommentController = require('../controllers/CommentController');

const router = new Router({mergeParams: true});

router.get('/',
    authMiddleware,
    ...getCommentsValidators(),
    CommentController.getComments);

router.get('/:commentId',
    authMiddleware,
    ...getFullCommentValidators(),
    CommentController.getFullComment);

router.post('/',
    authMiddleware,
    ...createCommentValidators(),
    CommentController.createComment);

router.put('/:commentId',
    authMiddleware,
    ...editCommentValidators(),
    CommentController.editComment);

router.delete('/:commentId',
    authMiddleware,
    ...deleteCommentValidators(),
    CommentController.deleteComment);

module.exports = router;