const ReviewModel = require('../models/reviewModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

const review = {
    showMyReviews : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        try{
            const result = await ReviewModel.showMyReview(userIdx);
            if(result.length === 0){
                const nickname = await ReviewModel.selectNickname(userIdx);
                console.log(nickname);
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_REVIEW, {
                    reviewIdx: 0,
                    userIdx: nickname[0].userIdx,
                    bookstoreIdx: 0,
                    content: 'NULL',
                    photo: 'NULL',
                    stars: 0,
                    createdAt: 'NULL',
                    nickname: nickname[0].nickname
                }));
            }
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result));

        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    writeReview : async (req, res) => {
        console.log('writeReview reviewPhoto : ',reviewPhoto);
        const userIdx = req.decoded.userIdx;
        let {bookstoreIdx, content, stars} = req.body;
        try{
            if (!bookstoreIdx || !content || !stars) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }
            const result = await ReviewModel.writeReview(userIdx, bookstoreIdx, content, reviewPhoto, stars);
            
            if(result === undefined){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_REVIEW));
            }else{
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_REVIEW_SUCCESS, 
                    result[0]
                ));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showReviewsByBookstore: async(req, res)=>{
        // const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        try{
            const result = await ReviewModel.showReviews(bookstoreIdx);
            if(result.length === 0){
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_REVIEW));
            }else{
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showTwoReviewsByBookstore: async(req, res) => {
        // const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        try {
            const result = await ReviewModel.showReviews(bookstoreIdx);
            console.log(result);
            if (result.length === 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_REVIEW));
            } else{
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result.slice(0,2)));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    deleteReview: async(req, res)=>{
        const userIdx = req.decoded.userIdx;
        const reviewIdx = req.params.reviewIdx;
        try{
            const result = await ReviewModel.deleteReview(reviewIdx);
            if(result === 1){
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_REVIEW, {reviewIdx: reviewIdx}));
            }else{
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_DELETE_REVIEW));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateReview: async(req, res)=>{
        const userIdx = req.decoded.userIdx;
        const reviewIdx = req.params.reviewIdx;
        try{
            const result = await ReviewModel.updateReview(reviewIdx);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REVIEW_UPDATING, result[0]))
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    storeUpdatedReview: async(req, res)=>{
        const userIdx = req.decoded.userIdx;
        const reviewIdx = req.params.reviewIdx;
        let {stars, content}= req.body;
        try{
            if(!stars || !content){
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }

            const result = await ReviewModel.storeUpdatedReview(reviewIdx, stars, content, reviewPhoto);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_REVIEW,
                    result[0]
                ));
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateReviewPhoto: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        if(req.file === undefined) {
            console.log('undefined-req.file: ', req.file)
            var reviewPhoto = 'NULL';
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_PHOTO, {photo: reviewPhoto}));
        } else {
            console.log('req.file: ', req.file);
            var reviewPhoto = req.file.location;
        }
        
        // data check - undefined
        if (reviewPhoto === undefined || !bookstoreIdx) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
        }
        // call model - database
        // 결과값은 프로필에 대한 이미지 전달
        // const result = await ReviewModel.updateReviewPhoto(bookstoreIdx, reviewPhoto);
        
        // return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_UPDATE_REVIEW_PHOTO, {photo: reviewPhoto}));
        return reviewPhoto;
    }
}

module.exports = review;