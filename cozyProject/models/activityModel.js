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
        // const dl = deadline.
        const date = moment().format('YYYY년 M월 D일 HH:mm');
        // const dead = moment(new Date(2020, 8, 15, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
        // console.log(dead);
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
        const now = moment().format('YYYY-MM-DD HH:mm');
        // console.log(now);
        const updateQuery = `UPDATE ${activityTable} SET today = '${now}' WHERE categoryIdx = ${categoryIdx}`;

        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.shortIntro, a.price, a.image, DATEDIFF(a.deadline, a.today) AS "dday"
            FROM ${activityTable} a, ${bookstoreTable} bs 
            WHERE a.bookstoreIdx = bs.bookstoreIdx 
            AND a.categoryIdx = ${categoryIdx}
            AND DATEDIFF(a.deadline, a.today) > -1
            ORDER BY a.createdAt DESC;`;
        try {
            await pool.queryParam(updateQuery);
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByLatest ERROR : ', err);
            throw err;
        }
    },
    // 👻 활동 탭에서 하나 클릭했을 때 -> 마감 임박 순
    showActivitiesByDeadline: async (categoryIdx) => {
        // DATEDIFF(deadline, curdate()) 말고 today 필드값 추가해줘서 카테고리 누르면 today에 현재시간으로 업데이트해주고 그 값을 이용해서 deadline과의 차이를 구함..
        const now = moment().format('YYYY-MM-DD HH:mm');
        // console.log(now);
        const updateQuery = `UPDATE ${activityTable} SET today = '${now}' WHERE categoryIdx = ${categoryIdx}`;

        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.shortIntro, a.price, a.image, DATEDIFF(a.deadline, a.today) AS "dday" 
            FROM ${activityTable} a, ${bookstoreTable} bs
            WHERE a.bookstoreIdx = bs.bookstoreIdx
            AND a.categoryIdx = ${categoryIdx} 
            AND DATEDIFF(a.deadline, a.today) > -1
            ORDER BY dday, a.createdAt DESC;`;
            // 아니면 마감일 지난 활동은 클라에서 비활성화 처리
        try {
            await pool.queryParam(updateQuery);
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