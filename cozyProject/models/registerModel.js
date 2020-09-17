const pool = require('../modules/pool');
//const { check } = require('../middlewares/session');
const bookstoreTable = 'bookstore';
const bookstoreImgTable = 'bookstoreImg';
const userTable = 'user';
const tasteTable = 'taste';

const bookstore = {
    updateImgOfBookstore: async(bookstoreIdx, locations)=>{
        let query = `update ${bookstoreTable} set mainImg = '${locations[0]}', profileImg='${locations[1]}' where bookstoreIdx = ${bookstoreIdx};`;
        try{
            await pool.queryParam(query);
            return 1;
        }catch(err){
            console.log('update img of bookstoreTable ERROR : ', err);
            throw err;
        }
    },
    updateImgOfBookstoreImg: async (bookstoreIdx, locations)=>{
        let query = `update ${bookstoreImgTable} set 
        image1 = '${locations[0]}', image2 = '${locations[1]}', image3 = '${locations[2]}',
        image4 = '${locations[3]}', image5 = '${locations[4]}', image6 = '${locations[5]}',
        image7 = '${locations[6]}' where bookstoreIdx = ${bookstoreIdx};`;
        try{
            await pool.queryParam(query);
            return 1;
        }catch(err){
            console.log('update img of bookstoreImgTable ERROR : ', err);
            throw err;
        }
    }
    
}

module.exports = bookstore;