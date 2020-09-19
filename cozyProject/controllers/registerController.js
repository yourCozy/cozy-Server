const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const pool = require('../modules/pool');
const RegisterModel = require('../models/registerModel');

const bookstore = {
    registerImage : async (req, res)=>{
        const bookstoreIdx = req.params.bookstoreIdx;
        let imageLocations = [];
        for(var i=0;i<2;i++){
            imageLocations[i]=req.files[i].location;
        }
        const result = await RegisterModel.updateImgOfBookstore(bookstoreIdx, imageLocations);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_IMAGE_SUCCESS, result));
    },
    registerDetailImage: async(req, res)=>{
        const bookstoreIdx = req.params.bookstoreIdx;
        let imageLocations = [];
        for(var i=0;i<7;i++){
            if(i<req.files.length){
                imageLocations[i]=req.files[i].location;
            }else{
                imageLocations[i]=null;
            }
        }
        const result = await RegisterModel.updateImgOfBookstoreImg(bookstoreIdx, imageLocations);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_IMAGE_SUCCESS, result));
    },
    registerActivityImage: async(req, res)=>{
        const activityIdx = req.params.activityIdx;
        let imageLocations=[];
        for(var i=0;i<10;i++){
            if(i<req.files.length){
                imageLocations[i]=req.files[i].location;
            }else{
                imageLocations[i]=null;
            }
        }
        const result = await RegisterModel.updateImgOfActivityImg(activityIdx, imageLocations);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_IMAGE_SUCCESS, result));
    }
}

module.exports = bookstore;