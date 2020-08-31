const axios = require('axios');

module.exports={
    kakao: async(req, res, next)=>{
        const accessToken = req.body.accessToken;
        try{
            let config = {
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", config);
            
            console.log('=====kakao userResponse data====');
            console.log('userResponse.data : ', userResponse.data);

            req.params = {
                "data" : userResponse.data
            }
            next();
        }catch(error){
            console.log('social middleware ERR : ', error);
            throw error;
        }
    }
}