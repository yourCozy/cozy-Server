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
        // TODO: dday 추가
        const now = moment().format('YYYY-MM-DD HH:mm');
        // console.log(now);
        const updateQuery = `UPDATE ${activityTable} SET today = '${now}' WHERE bookstoreIdx = ${bookstoreIdx}`;

        const query = `SELECT activityIdx, activityName, shortIntro, image, price, DATEDIFF(deadline, today) AS "dday" 
                        FROM ${activityTable} 
                        WHERE bookstoreIdx = ${bookstoreIdx}
                        AND DATEDIFF(deadline, today) > -1`
        try {
            await pool.queryParam(updateQuery);
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
        const now = moment().format('YYYY-MM-DD HH:mm'); //현재 시간
        // console.log(now);
        const updateQuery = `UPDATE ${activityTable} SET today = '${now}' WHERE categoryIdx = ${categoryIdx}`;
        //카테고리idx 맞으면 현재 시간 today 로 업데이트
        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.price, a.image, DATEDIFF(a.deadline, a.today) AS "dday"
            FROM ${activityTable} a, ${bookstoreTable} bs 
            WHERE a.bookstoreIdx = bs.bookstoreIdx 
            AND a.categoryIdx = ${categoryIdx}
            AND DATEDIFF(a.deadline, a.today) > -1
            ORDER BY a.createdAt DESC;`;
            //활동 서점인덱스 = 서점 서점인덱스 같을 시, 그리고 카테고리 인덱스 같을 시
            //datediff d-0까지만 나오게, -1이면 마감일 지난걸로 처리, 안 나오도록
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

        const query = `SELECT a.activityIdx, bs.bookstoreName, a.activityName, a.price, a.image, DATEDIFF(a.deadline, a.today) AS "dday" 
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
        // TODO: dday 추가
        const now = moment().format('YYYY-MM-DD');
        console.log(now);
        const updateQuery = `UPDATE ${activityTable} SET today = '${now}' WHERE activityIdx = ${activityIdx}`;

        const deadlineQuery = `SELECT deadline FROM ${activityTable} WHERE activityIdx = ${activityIdx}`;
        // console.log()

        const query = `SELECT activityIdx, activityName, categoryName, period, limitation, price, introduction, DATEDIFF(deadline, today) AS "dday" FROM ${activityTable} WHERE activityIdx = '${activityIdx}'`;
        try{
            const deadlineResult = await pool.queryParam(deadlineQuery);
            const dl = moment(deadlineResult[0]).format('YYYY-MM-DD');
            await pool.queryParam(updateQuery);
            const result = await pool.queryParam(query);
            result[0].deadline = dl;
            return result;
        }catch(err){
            console.log('showActivityDetail ERROR : ', err);
            throw err;
        }
    }
}

module.exports = activity;