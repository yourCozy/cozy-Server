    const pool = require('../modules/pool');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const reviewTable = 'review'; 

const review = {
    selectNickname: async (userIdx) => {
        let query = `SELECT * FROM ${userTable} WHERE userIdx = ${userIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }
    },
    writeReview: async(userIdx, bookstoreIdx, content, photo, stars)=>{
        const fields = 'userIdx, bookstoreIdx, content, photo, stars, createdAt';
        // "2020년 7월 4일 17:00 작성"
        const date = moment().format('YYYY년 M월 D일 HH:mm 작성');
        console.log(date);
        let query = `insert into ${reviewTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, '${content}', '${photo}', ${stars}, '${date}')`;
        try{
            let result = await pool.queryParam(query);
            query = `SELECT r.*, u.nickname, u.profile FROM ${reviewTable} r, ${userTable} u WHERE r.reviewIdx = ${result.insertId} and u.userIdx=${userIdx}`;
            result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('writeReview ERROR : ',err);
            throw err;
        }
    },
    showMyReview: async(userIdx) => {
        const query = `SELECT r.*, u.nickname FROM ${reviewTable} r, ${userTable} u WHERE r.userIdx = u.userIdx AND r.userIdx = ${userIdx} ORDER BY reviewIdx DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err) {
            if (err.errno == 1062) {
                console.log('show my review ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('show my review ERROR : ', err);
            throw err;
        }
    },
    showReviews: async(bookstoreIdx)=>{
        const query = `SELECT r.*, u.nickname, u.profile FROM ${reviewTable} r, ${userTable} u 
                        WHERE r.bookstoreIdx = ${bookstoreIdx} 
                        AND u.userIdx = r.userIdx
                        ORDER BY r.createdAt DESC;`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showAllReview ERROR : ',err);
            throw err;
        }
    },
    deleteReview: async(reviewIdx)=>{
        const query = `delete from ${reviewTable} where reviewIdx=${reviewIdx}`;
        try{
            await pool.queryParam(query);
            return 1;
        }catch(err){
            console.log('deleteReview ERROR : ',err);
            throw err;
        }
    },
    updateReview: async(reviewIdx)=>{
        const query = `select * from ${reviewTable} where reviewIdx=${reviewIdx};`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('updateReview ERROR : ',err);
            throw err;
        }
    },
    storeUpdatedReview: async(reviewIdx, stars, content, reviewPhoto)=>{
        const date = moment().format('YYYY년 M월 D일 HH:mm 수정');
        let query = `update ${reviewTable} set stars =${stars}, content = '${content}', photo = '${reviewPhoto}', createdAt = '${date}' where reviewIdx = ${reviewIdx}`;
        try{
            await pool.queryParam(query);
            query = `SELECT * FROM ${reviewTable} WHERE reviewIdx = ${reviewIdx};`; 
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('storeUpdatedReview ERROR : ',err);
            throw err;
        }
    },
    updateReviewPhoto: async(bookstoreIdx, reviewPhoto) => {
    let query = `UPDATE ${reviewTable} SET photo = '${reviewPhoto}' WHERE bookstoreIdx = ${bookstoreIdx};`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update review photo ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update review photo ERROR : ', err);
            throw err;
        }
    }
}

module.exports = review;