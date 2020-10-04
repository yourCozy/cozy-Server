    const pool = require('../modules/pool');
var moment = require('moment');
const bookstore = require('./bookstoreModel');
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
        // const query = `SELECT r.*, u.nickname FROM ${reviewTable} r, ${userTable} u WHERE r.userIdx = u.userIdx AND r.userIdx = ${userIdx} ORDER BY reviewIdx DESC`;
        const query = `SELECT reviewIdx, userIdx, bookstoreIdx, content, photo, stars, createdAt FROM ${reviewTable} WHERE userIdx = ${userIdx} ORDER BY reviewIdx DESC`;
        
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
    },
    writeSimpleReview: async (userIdx, bookstoreIdx, facilityNum, bookNum, activityNum, foodNum) => {
        // TODO: 이렇게 해주면 상세 후기에서도 null 값이면 후기 안보여주게 처리해주어야 함 or DB review_simple 테이블 따로 만들어주던가
        const fields = `userIdx, bookstoreIdx, facilityNum, bookNum, activityNum, foodNum`;
        const questions = '?, ?, ?, ?, ?, ?';
        const values = [userIdx, bookstoreIdx, facilityNum, bookNum, activityNum, foodNum];
        const selectQuery = `SELECT * FROM ${reviewTable} WHERE userIdx = ${userIdx} AND bookstoreIdx = ${bookstoreIdx}`;
        const insertQuery = `INSERT INTO ${reviewTable}(${fields}) VALUES(${questions})`;
        const updateQuery = `UPDATE ${reviewTable} 
                            SET facilityNum = ${facilityNum}, bookNum = ${bookNum}, activityNum = ${activityNum}, foodNum = ${foodNum}
                            WHERE userIdx = ${userIdx} 
                            AND bookstoreIdx = ${bookstoreIdx}`;

        try {
            let result = await pool.queryParam(selectQuery);
            if (result.length > 0) {
                console.log("update");
                await pool.queryParam(updateQuery);
                result = await pool.queryParam(selectQuery);
                return result[0].reviewIdx;
            } else {
                console.log("insert");
                result = await pool.queryParamArr(insertQuery, values);
                reviewIdx = result.insertId;
                return reviewIdx;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('write simple review ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('write simple review ERROR : ', err);
            throw err;
        }

        
    },
    showSimpleReviews: async (bookstoreIdx) => {
        const query = `SELECT avg(facilityNum) AS avg_fac, avg(bookNum) AS avg_book, avg(nullif(activityNum, 4)) AS avg_act, avg(nullif(foodNum, 4)) AS avg_food
                        FROM ${reviewTable}
                        WHERE bookstoreIdx = ${bookstoreIdx} 
                        GROUP BY bookstoreIdx`;

        const cntAct1 = `SELECT count(activityNum) AS cnt_act1 FROM ${reviewTable} WHERE activityNum = 4 AND bookstoreIdx = ${bookstoreIdx} GROUP BY bookstoreIdx`;
        const cntAct2 = `SELECT count(activityNum) AS cnt_act2 FROM ${reviewTable} WHERE bookstoreIdx = ${bookstoreIdx} GROUP BY bookstoreIdx`;
        const cntFood1 = `SELECT count(foodNum) AS cnt_food1 FROM ${reviewTable} WHERE foodNum = 4 AND bookstoreIdx = ${bookstoreIdx} GROUP BY bookstoreIdx`;
        const cntFood2 = `SELECT count(foodNum) AS cnt_food2 FROM ${reviewTable} WHERE bookstoreIdx = ${bookstoreIdx} GROUP BY bookstoreIdx`;

        try {
            let result = await pool.queryParam(query);
            if (result.length > 0) {
                const act1Result = await pool.queryParam(cntAct1); // 해당없음 행 개수
                const act2Result = await pool.queryParam(cntAct2); // 전체 activity 행 개수
                const food1Result = await pool.queryParam(cntFood1); // 해당없음 행 개수
                const food2Result = await pool.queryParam(cntFood2); // 전체 food 행 개수

                console.log('showSimpleReviews result.length>0: ',act1Result, act2Result, food1Result, food2Result);


                // console.log(act2Result[0].cnt_act2 / 2, act1Result[0].cnt_act1, food2Result[0].cnt_food2 / 2, food1Result[0].cnt_food1);

                // if ((act2Result[0].cnt_act2 / 2) >= act1Result[0].cnt_act1 && (food2Result[0].cnt_food2 / 2) >= food1Result[0].cnt_food1) {
                //     console.log("1: ", result);
                //     return result;
                // } 

                if (act1Result.length > 0) {
                    if ((act2Result[0].cnt_act2 / 2) < act1Result[0].cnt_act1) {
                        result[0].avg_act = 4;
                        console.log("2: ",result);
                    } 
                } else {
                    if ((act2Result[0].cnt_act2 / 2) < 0) {
                        result[0].avg_act = 4;
                        console.log("2: ",result);
                    }
                } 
                if (food1Result.length > 0) {
                    if ((food2Result[0].cnt_food2 / 2) < food1Result[0].cnt_food1) {
                        console.log("3: ", result);
                        result[0].avg_food = 4;
                    }
                } else {
                    if ((food2Result[0].cnt_food2 / 2) < 0) {
                        console.log("3: ", result);
                        result[0].avg_food = 4;
                    }
                }
            }
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('show simple reviews ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('show simple reviews ERROR : ', err);
            throw err;
        }
    }
}

module.exports = review;