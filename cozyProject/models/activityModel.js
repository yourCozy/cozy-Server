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
    showActivitiesByBookstore: async (bookstoreIdx) => {
        const query = `SELECT * FROM ${activityTable} WHERE bookstoreIdx = ${bookstoreIdx}`
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByBookstore ERROR : ', err);
            throw err;
        }
    },
    registerActivity: async (bookstoreIdx, activityName, categoryIdx, price, limitation, introduction, period, deadline, image) => {
        const date = moment().format('YYYY년 M월 D일 HH:mm');
        const fields = 'bookstoreIdx, activityName, categoryIdx, price, limitation, introduction, period, deadline, image, createdAt';
        // insert into activity(bookstoreIdx, activityName, categoryIdx, createdAt, deadline) values(1, "공연2", 6, "2020년 8월 22일", '2020-08-31');
        const values = [bookstoreIdx, activityName, categoryIdx, price, limitation, introduction, period, deadline, image, date];
        const questions = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?'

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
    showActivitiesByLatest: async (categoryIdx) => {

        const query = `SELECT bs.bookstoreName, a.activityName, a.introduction, a.price, a.image, DATEDIFF(a.deadline, curdate()) AS "dday" 
            FROM ${activityTable} a, ${bookstoreTable} bs
            WHERE a.bookstoreIdx = bs.bookstoreIdx
            AND a.categoryIdx = ${categoryIdx} 
            AND a.deadline - curdate() > -1
            ORDER BY a.createdAt DESC;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByLatest ERROR : ', err);
            throw err;
        }
    },
    showActivitiesByDeadline: async (categoryIdx) => {
        // 날짜 차이 가져오기 
        // const diffQuery = `SELECT DATEDIFF`
        const now = moment();
        const query = `SELECT bs.bookstoreName, a.activityName, a.introduction, a.price, a.image, DATEDIFF(a.deadline, curdate()) AS "dday" 
            FROM ${activityTable} a, ${bookstoreTable} bs
            WHERE a.bookstoreIdx = bs.bookstoreIdx
            AND a.categoryIdx = ${categoryIdx} 
            AND a.deadline - curdate() > -1
            ORDER BY dday, a.createdAt DESC;`;
            // 아니면 마감일 지난 활동은 클라에서 비활성화 처리
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByDeadline ERROR : ', err);
            throw err;
        }
    }
}

module.exports = activity;