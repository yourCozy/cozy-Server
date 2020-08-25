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
    registerActivity: async (bookstoreIdx, bookstoreName, categoryIdx, deadline) => {
        const date = moment().format('YYYY년 M월 D일 HH:mm');
        const fields = 'bookstoreIdx, activityName, categoryIdx, createdAt, deadline';
        // insert into activity(bookstoreIdx, activityName, categoryIdx, createdAt, deadline) values(1, "공연2", 6, "2020년 8월 22일", '2020-08-31');
        const values = [bookstoreIdx, bookstoreName, categoryIdx, date, deadline];
        const questions = '?, ?, ?, ?, ?'

        const query = `INSERT INTO ${activityTable}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            console.log('insertId: ',insertId);
            return insertId;
        } catch (err) {
            console.log('showActivitiesByCategory ERROR : ', err);
            throw err;
        }
    },
    showActivitiesByLatest: async (categoryIdx) => {
        const query = `SELECT * FROM ${activityTable} WHERE categoryIdx = ${categoryIdx} ORDER BY createdAt DESC`;
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
        const query = `SELECT *, DATEDIFF(deadline, curdate()) AS "dday" FROM ${activityTable} 
            WHERE categoryIdx = ${categoryIdx} 
            AND deadline - curdate() > -1
            ORDER BY dday;`;
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