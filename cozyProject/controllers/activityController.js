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
    showActivitiesByCategory: async (req, res) => {
        const categoryIdx = req.params.categoryIdx;
        const userIdx = req.decoded.userIdx; // 북마크 여부때문에 필요
        // console.log('categoryIdx: ',categoryIdx);
        try {
            const activitiesByCategory = await ActivityModel.showActivitiesByCategory(userIdx, categoryIdx);
            if (!activitiesByCategory.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, activitiesByCategory));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showActivitiesByFilter: async (req, res) => {
        
    }
}

module.exports = activity;