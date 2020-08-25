const ActivityModel = require('../models/activityModel');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');
const multer = require('../modules/multer');

const activity = {
    showRecommendation: async (req, res) => {
        
    },
    showActivities: async (req, res) => {

    },
    registerActivity: async (req, res) => {
        const {bookstoreIdx, activityName, categoryIdx, deadline} = req.body;

        try{
            if (!bookstoreIdx || !activityName || !categoryIdx) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }
            const idx = await ActivityModel.registerActivity(bookstoreIdx, activityName, categoryIdx, deadline);
            
            if(idx === -1){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_REVIEW));
            }else{
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_REVIEW_SUCCESS, idx));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByLatest: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByLatest = await ActivityModel.showActivitiesByLatest(categoryIdx);
            if (!activitiesByLatest.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByLatest));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByDeadline: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;

        try {
            const activitiesByDeadline = await ActivityModel.showActivitiesByDeadline(categoryIdx);
            if (!activitiesByDeadline.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ACT_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ACT_DATA_SUCCESS, activitiesByDeadline));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = activity;