const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
// const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const tasteTable = 'taste';

const bookstore = {
    showRecommendation: async (userIdx) => {

        // TODO: 사용자별로 취향에 따라 검색, 북마크 여부 추가
        // const userQuery =  `SELECT bookstores FROM ${tasteTable} WHERE userIdx = ${userIdx}`;

        const query = `SELECT bs.bookstoreIdx, bs.profileImg, bs.shortIntro1, bs.shortIntro2, bs.bookstoreName, bs.location, u.nickname FROM ${bookstoreTable} bs, ${userTable} u 
                        WHERE userIdx = ${userIdx}
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
                        // bs.profileImg != 'NULL' AND bs.shortIntro1 != 'NULL' 나중에 추가해주기
        try {
            // const userResult = await pool.queryParam(userQuery);
            // console.log('userResult: ', userResult[0].bookstores);
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showDetail: async (userIdx, bookstoreIdx) => {
        const bookmarkQuery = `SELECT * FROM ${bookmarksTable} WHERE bookstoreIdx = ${bookstoreIdx} AND userIdx = ${userIdx};`;
        const query = `select bs.* from ${bookstoreTable} bs, ${userTable} u
        where bs.bookstoreIdx = ${bookstoreIdx} and u.userIdx = ${userIdx};`;

        try {
            const bookmarkResult = await pool.queryParam(bookmarkQuery);
            if (bookmarkResult.length === 0) {
                var checked = 0;
            } else checked = 1;
            const result = await pool.queryParam(query);
            result[0].checked = checked;
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showBookstoresBySection: async (userIdx, sectionIdx) => {
        // location section별로
        const location = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profileImg, bs.image1 from ${bookstoreTable} bs
                        WHERE bs.sectionIdx = ${sectionIdx};`;

        // checked된 책방만 seciton별로
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profileImg, bs.image1 from bookstore bs, bookmarks bm
        where bs.sectionIdx = ${sectionIdx} and bs.bookstoreIdx = bm.bookstoreIdx and bm.userIdx = ${userIdx};`;

        // const query = `select bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1, bm.checked from ${bookstoreTable} bs, ${imagesTable} i, ${bookmarksTable} bm
        // where bs.sectionIdx = ${sectionIdx} and bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = bm.bookstoreIdx;`;

        try {
            let locationResult = await pool.queryParam(location);
            // let bookmarkResult = await pool.queryParam(bookmark);
            let queryResult = await pool.queryParam(query);

            for (var a in locationResult) {
                var checked=0;
                for (var b in queryResult) {
                    if(locationResult[a].bookstoreIdx === queryResult[b].bookstoreIdx){
                        console.log('success');
                        checked = 1;
                        break;
                    }
                }
                locationResult[a].checked = checked;
                locationResult[a].count = locationResult.length;
            }
            
            return locationResult;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('show location ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('show location ERROR : ', err);
            throw err;
        }
    },
    checkBookStore: async (bookstoreIdx) => {
        const query = `select bookstoreIdx from ${bookstoreTable} where bookstoreIdx = ${bookstoreIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('check bookstore ERROR : ',err);
            throw err;
        }
    },
    searchByKeyword: async (keyword) => {
        //const match = 'bookstoreName, location, activity, shortIntro, shortIntro2, description, hashtag1, hashtag2, hashtag3';
        //const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        const query = `select bs.* from ${bookstoreTable} bs
                        where (binary bs.bookstoreName like "%${keyword}%" 
                        or binary location like "%${keyword}%" 
                        or binary activities like "%${keyword}%" 
                        or binary shortIntro1 like "%${keyword}%" 
                        or binary shortIntro2 like "%${keyword}%" 
                        or binary description like "%${keyword}%" 
                        or binary hashtag1 like "%${keyword}%" 
                        or binary hashtag2 like "%${keyword}%" 
                        or binary hashtag3 like "%${keyword}%")
                        order by bookmark desc;`;
        // console.log('search query : ', query);
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }                
    },
    showTastes: async(userIdx) => {
        const query = `SELECT * from ${tasteTable} WHERE userIdx = ${userIdx}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('show tastes ERROR : ', err);
            throw err;
        }
    },
    orderByTastes: async(userIdx, tastes) => {
        let tastesArray = tastes.split(','); // / 도 나눠질 수 있도록 추가
        let count = 0;

        /**
         * select bookstoreIdx, bookstoreName, activities from cozy.bookstore
            where activities like '%공연%' or activities like '%전시%'
            or bookstoreName like '%놀이터%';  
         */

        let strQuery = `SELECT bookstoreIdx, bookstoreName, activities FROM ${bookstoreTable} WHERE `;
        let fields = ['bookstoreName', 'activities'];

        for (var field in fields) {
            for (var taste in tastesArray) {
                if (count === 0) {
                    strQuery = strQuery + `${fields[field]} LIKE '%${tastesArray[taste]}%'`;
                }
                else {
                    strQuery = strQuery + ` OR ${fields[field]} LIKE '%${tastesArray[taste]}%'`;
                }
                count++;
            }
        }
        strQuery = strQuery + `LIMIT 8`
        
        console.log('strQuery: ',strQuery);

        try {
            const result = await pool.queryParam(strQuery);
            return result;
        } catch (err) {
            console.log('order by tastes ERROR : ', err);
            throw err;
        }
    }
}

module.exports = bookstore;