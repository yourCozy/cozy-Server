var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/auth');
const commentController = require('../controllers/commentController.js');

router.get('/mycomments', AuthMiddleware.checkToken, commentController.showMyComments); //내가 쓴 댓글 보기

// review api 처럼 uri 처리해줌!

router.post('/:activityIdx', AuthMiddleware.checkToken, commentController.writeComment); //댓글 작성

router.get('/activity/:activityIdx', AuthMiddleware.checkToken, commentController.showAllCommentsOfActivity); //활동의 모든 댓글 보기

// 클라에서 필요하다하면 쓸 것.
// router.get('/:commentIdx', AuthMiddleware.checkToken, commentController.showCheckedComment); // 수정할 댓글 조회

router.put('/:commentIdx', AuthMiddleware.checkToken, commentController.UpdateComment); //댓글 수정

router.delete('/:commentIdx', AuthMiddleware.checkToken, commentController.deleteComment); //댓글 삭제

module.exports = router;