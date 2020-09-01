const axios = require('axios');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

module.exports={
    kakao: async(req, res, next)=>{
        /*
        const accessToken = req.body.accessToken;
        try{
            let config = {
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", config);
            
            console.log('=====kakao userResponse data====');
            //console.log('userResponse.data : ', userResponse.data);
            console.log('userResponse : ', userResponse);
            req.params = {
                "data" : userResponse.data
            }
            next();
        }catch(error){
            if(error.request.res.statusCode===401){
                return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
            }else{
                console.log('kakao middleware ERR (not 401) : ', error);
                throw error;
            }
        }
        */
    }
}