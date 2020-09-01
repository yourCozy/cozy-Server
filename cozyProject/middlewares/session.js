const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

module.exports = {
    check : async(req, res, next)=>{
        if(req.session.userIdx === undefined){
            /**
             * 로그인 페이지로 넘어가기
             */
            console.log('req.session.userIdx 없음. 로그인이 필요합니다.');
            return res.json(util.fail(statusCode.OK, resMessage.EXPIRED_TOKEN));
        }else{
            console.log('인증되었습니다. userIdx : ', req.session.userIdx);
            next();
        }
    }
};