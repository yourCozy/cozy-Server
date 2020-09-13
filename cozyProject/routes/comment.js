var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const commentController = require('../controllers/commentController.js');

router.get('/mycomments', AuthMiddleware.checkToken, commentController.showMyComments); //내가 쓴 댓글 보기

router.post('/write/:activityIdx', AuthMiddleware.checkToken, commentController.writeComment); //댓글 작성

router.get('/show/:activityIdx', AuthMiddleware.checkToken, commentController.showAllCommentsOfActivity); //활동의 모든 댓글 보기

router.put('/update/:commentIdx', AuthMiddleware.checkToken, commentController.UpdateComment); //댓글 수정

router.delete('/delete/:commentIdx', AuthMiddleware.checkToken, commentController.deleteComment); //댓글 삭제

module.exports = router;