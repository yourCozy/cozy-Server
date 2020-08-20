const pool = require('../modules/pool');

const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';

const mypage = {
    showInterest: async (userIdx) => {
        let query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname, i.image1 FROM ${bookstoreTable} A, ${bookmarksTable} B, ${userTable} C, ${imagesTable} i 
        WHERE B.userIdx = ${userIdx} and A.bookstoreIdx=B.bookstoreIdx and B.userIdx = C.userIdx and A.bookstoreIdx = i.bookstoreIdx order by B.bookmarkIdx desc;`;
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
            console.log('search by keyword ERROR : ', err);
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
    selectProfile: async(bookstoreIdx)=>{
        const query = `SELECT b.bookstoreIdx, b.bookstoreName, b.profile, i.image1 FROM ${bookstoreTable} b, ${imagesTable} i
                    WHERE b.bookstoreIdx = ${bookstoreIdx} AND b.bookstoreIdx = i.bookstoreIdx;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('select profile ERROR : ', err);
            throw err;
        }
    },
}