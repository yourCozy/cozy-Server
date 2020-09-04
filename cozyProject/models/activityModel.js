const pool = require('../modules/pool');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const activityTable = 'activity';
const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';

const activity = {
    // 👻 디테일 뷰에서 활동 그리드 뷰로 보는거
    showActivitiesByBookstore: async (bookstoreIdx) => {
        const query = `SELECT activityIdx, activityName, shortIntro, image, price FROM ${activityTable} WHERE bookstoreIdx = ${bookstoreIdx}`
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByBookstore ERROR : ', err);
            throw err;
        }
    },
    registerActivity: async (bookstoreIdx, activityName, categoryIdx, categoryName, price, limitation, shortIntro, introduction, period, deadline, image) => {
        // 사진 개수 필드 추가해야 함. 
        const date = moment().format('YYYY년 M월 D일 HH:mm');
        const fields = 'bookstoreIdx, activityName, categoryIdx, categoryName, price, limitation, shortIntro, introduction, period, deadline, image, createdAt';
        // insert into activity(bookstoreIdx, activityName, categoryIdx, createdAt, deadline) values(1, "공연2", 6, "2020년 8월 22일", '2020-08-31');
        const values = [bookstoreIdx, activityName, categoryIdx, categoryName, price, limitation, shortIntro, introduction, period, deadline, image, date];
        const questions = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?'

        const query = `INSERT INTO ${activityTable}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            console.log('insertId: ',insertId);
            return insertId;
        } catch (err) {
            console.log('register Activity ERROR : ', err);
            throw err;
        }
    },
    // 👻 활동 탭에서 하나 클릭했을 때 -> 최신순
    showActivitiesByLatest: async (categoryIdx) => {
        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.shortIntro, a.price, a.image
            FROM ${activityTable} a, ${bookstoreTable} bs 
            WHERE a.bookstoreIdx = bs.bookstoreIdx 
            AND a.categoryIdx = ${categoryIdx}
            ORDER BY a.deadline DESC;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByLatest ERROR : ', err);
            throw err;
        }
    },
    // 👻 활동 탭에서 하나 클릭했을 때 -> 마감 임박 순
    showActivitiesByDeadline: async (categoryIdx) => {
        // 날짜 차이 가져오기 
        //const diffQuery = `SELECT DATEDIFF`
        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.shortIntro, a.price, a.image 
            FROM ${activityTable} a, ${bookstoreTable} bs
            WHERE a.bookstoreIdx = bs.bookstoreIdx
            AND a.categoryIdx = ${categoryIdx}
            ORDER BY a.createdAt DESC;`;
            // 아니면 마감일 지난 활동은 클라에서 비활성화 처리
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByDeadline ERROR : ', err);
            throw err;
        }
    },
    // 👻 활동 하나 자세히 보기
    showActivityDetail: async (activityIdx)=>{
        const query = `SELECT * FROM ${activityTable} WHERE activityIdx = '${activityIdx}'`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showActivityDetail ERROR : ', err);
            throw err;
        }
    }
}

module.exports = activity;