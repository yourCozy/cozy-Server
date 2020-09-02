const pool = require('../modules/pool');
const { queryParamArr } = require('../modules/pool');

const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const tasteTable = 'taste';

const mypage = {
    showInterest: async (userIdx) => {
        let query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profileImg, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname, A.image1 
                        FROM ${bookstoreTable} A, ${bookmarksTable} B, ${userTable} C
                        WHERE B.userIdx = ${userIdx} 
                        AND A.bookstoreIdx=B.bookstoreIdx 
                        AND B.userIdx = C.userIdx 
                        ORDER BY B.bookmarkIdx desc;`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showInterest ERROR : ', err);
            throw err;
        }
    },
    selectNickname: async (userIdx) => {
        let query = `SELECT * FROM ${userTable} WHERE userIdx = ${userIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('select nickname ERROR : ', err);
            throw err;
        }
    },
    updateBookmark: async (userIdx, bookstoreIdx) => {
        const fields = 'userIdx, bookstoreIdx, checked';
        let query = `delete from ${bookmarksTable} where userIdx=${userIdx} and bookstoreIdx=${bookstoreIdx}`;//북마크 해제
        const result = await module.exports.checkInterest(userIdx, bookstoreIdx);
        let query2 = `update ${bookstoreTable} set bookmark=bookmark-1 where bookstoreIdx=${bookstoreIdx}`;//북마크 -1
        if(result === 0 ){
            query = `insert into ${bookmarksTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, 1)`;//북마크 설정
            query2 = `update ${bookstoreTable} set bookmark=bookmark+1 where bookstoreIdx=${bookstoreIdx}`;
        }
        try{
            await pool.queryParam(query);
            await pool.queryParam(query2);
            if(result === 0){//result==0 이면 북마크 설정한 것. 
                return 1;
            }else{//result==1 이면 북마크 해제한 것.
                return 0;
            }
        }catch(err){
            console.log('update bookmarks ERROR : ', err);
            throw err;
        }
    },
    checkInterest: async(userIdx, bookstoreIdx)=>{
        const query = `select * from ${bookmarksTable} where userIdx = ${userIdx} and bookstoreIdx=${bookstoreIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result.length === 0){
                return 0;//checked 안되어있음 -> 관심책방으로 등록해야
            }else{
                return 1;//checked 되어있음 -> 관심책방으로 선정되어 있음 -> 관심책방 해제해야.
            }
        }catch(err){
            console.log('checkInterest bookmarks ERROR : ', err);
            throw err;
        }
    },
    selectProfile: async(bookstoreIdx)=>{
        const query = `SELECT b.bookstoreIdx, b.bookstoreName, b.profileImg, b.image1 FROM ${bookstoreTable} b
                        WHERE b.bookstoreIdx = ${bookstoreIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('select profile ERROR : ', err);
            throw err;
        }
    },
    checkUser: async (userIdx) => {
        const query = `SELECT * FROM ${tasteTable} WHERE userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('register recommendation ERROR : ', err);
            throw err;
        }
    },
    registerTastes: async(userIdx, opt) => {
        // 자바스크립트 배열을 문자열로 변환
        // const optStr = opt.join(',');
        // console.log(optStr);
        
        const query = `INSERT INTO ${tasteTable}(userIdx, tastes) VALUES(${userIdx}, '${opt}')`;
        try {
            await pool.queryParam(query);
            const resultQuery = `SELECT * FROM ${tasteTable} WHERE userIdx = ${userIdx}`;
            const result = await pool.queryParam(resultQuery);
            return result;
        } catch (err) {
            console.log('register recommendation ERROR : ', err);
            throw err;
        }
    },
    updateTastes: async(userIdx, opt) => {
        const query = `UPDATE ${tasteTable} SET tastes = '${opt}' WHERE userIdx = ${userIdx}`;
        try {
            await pool.queryParam(query);
            const resultQuery = `SELECT * FROM ${tasteTable} WHERE userIdx = ${userIdx}`;
            const result = await pool.queryParam(resultQuery);
            return result;
        } catch (err) {
            console.log('update tastes ERROR : ', err);
            throw err;
        }
    },
}

module.exports = mypage;