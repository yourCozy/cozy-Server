const CommentModel = require('../models/commentModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

const comment = {
    // 내가 쓴 댓글 보기 , 토큰 필요
    showMyComments : async (req, res) => {
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            const userIdx = req.decoded.userIdx;
            try{
                const result = await CommentModel.showMyComment(userIdx);
                if(result.length === 0){
                    const nickname = await CommentModel.selectNickname(userIdx);
                    console.log(nickname);
                    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_COMMENT, {
                        commentIdx: 0,
                        userIdx: nickname[0].userIdx,
                        bookstoreIdx: 0,
                        content: 'NULL',
                        createdAt: 'NULL',
                        nickname: nickname[0].nickname
                    }));
                }
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_COMMENT, result));
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    // 댓글 작성 , 토큰 필요
    writeComment : async (req, res) => {
        let {content} = req.body;
        const bookstoreIdx = req.params.bookstoreIdx;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            const userIdx = req.decoded.userIdx;
            try{
                if (!bookstoreIdx || !content) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                const result = await CommentModel.writeComment(userIdx, bookstoreIdx, content);
                if(result === undefined){
                    res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_COMMENT));
                }else{
                    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_COMMENT_SUCCESS, 
                        result[0]
                    ));
                }
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    // 댓글 삭제 , 토큰 필요
    deleteComment: async(req, res)=>{
        const commentIdx = req.params.commentIdx;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else{ 
            const userIdx = req.decoded.userIdx;
            try{
                 const comment = await CommentModel.checkComment(commentIdx);
                 if (!comment.length){
                     return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_COMMENT));
                 }
                const result = await CommentModel.deleteComment(commentIdx);
                if(result === 1){
                    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_COMMENT, {commentIdx: commentIdx}));
                }else{
                    res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_DELETE_COMMENT));
                }
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    // 댓글 수정, 토큰 필요
    UpdateComment : async(req, res)=>{
        const commentIdx = req.params.commentIdx;
        let {content}= req.body;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            //const userIdx = req.decoded.userIdx;
            try{
                if(!content){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                const result = await CommentModel.UpdateComment(commentIdx, content);
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_COMMENT,
                        result[0]
                    ));
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    //댓글 보여주기 , 토큰 필요 X
    showComment : async(req, res)=>{
        const commentIdx = req.params.commentIdx;
        try{
            const result = await CommentModel.showComment(commentIdx);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_COMMENT,
                    result[0]
                ));
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
}
module.exports = comment;