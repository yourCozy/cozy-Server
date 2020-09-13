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
                }else{
                    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_COMMENT, result));
                }
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    // 댓글 작성 , 토큰 필요
    writeComment : async (req, res) => {
        let {content} = req.body;
        const ActivityIdx = req.params.activityIdx;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            const userIdx = req.decoded.userIdx;
            try{
                if (!ActivityIdx || !content) {
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                const result = await CommentModel.writeComment(userIdx, ActivityIdx, content);
                module.exports.showAllCommentsOfActivity(req, res);
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
                    const activityIdx = comment[0].activityIdx;
                    const result = await CommentModel.showAllComment(activityIdx);
                    
                    if(result.length===0){
                        return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_COMMENT));
                    }else{
                        for(var i = 0; i<result.length; i++){
                            if(result[i].userIdx==userIdx){
                                result[i].mine = 1
                            }else{
                                result[i].mine = 0
                            }
                        }
                        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_COMMENT, result));
                    }
                    //res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_COMMENT, {commentIdx: commentIdx}));
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
        let {activityIdx, content}= req.body;
        if (req.decoded === undefined) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.EMPTY_TOKEN));
        } else {
            //const userIdx = req.decoded.userIdx;
            try{
                if(!content){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
                }
                await CommentModel.UpdateComment(commentIdx, content);
                const result = await CommentModel.showAllComment(activityIdx);
                if(result.length===0){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_COMMENT));
                }else{
                    const userIdx = req.decoded.userIdx;
                    for(var i = 0; i<result.length; i++){
                        if(result[i].userIdx==userIdx){
                            result[i].mine = 1
                        }else{
                            result[i].mine = 0
                        }
                    }
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_COMMENT, result));
                }
                /*
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_COMMENT,
                        result[0]
                    ));
                */
            }catch(err){
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    },
    /**
     * mine = 1 : jwt의 user가 작성한 댓글
     * mine = 0 : 다른 사람이 작성한 댓글
     */
    showAllCommentsOfActivity: async(req, res)=>{
        const activityIdx = req.params.activityIdx;
        const result = await CommentModel.showAllComment(activityIdx);
        if(req.decoded===undefined){
            if(result.length===0){
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_COMMENT));
            }else{
                for(var i = 0; i<result.length; i++){
                    result[i].mine = 0
                }
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_COMMENT, result));
            }
        }else{
            try{
                if(result.length===0){
                    return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_COMMENT));
                }else{
                    const userIdx = req.decoded.userIdx;
                    for(var i = 0; i<result.length; i++){
                        if(result[i].userIdx==userIdx){
                            result[i].mine = 1
                        }else{
                            result[i].mine = 0
                        }
                    }
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_COMMENT, result));
                }
            }catch(err){
                return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
        }
    }
}
module.exports = comment;