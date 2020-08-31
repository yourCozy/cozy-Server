const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';

const bookstore = {
    showRecommendation: async (userIdx) => {
        const query = `SELECT bs.bookstoreIdx, bs.profileImg, bs.shortIntro1, bs.shortIntro2, bs.bookstoreName, bs.location, u.nickname FROM ${bookstoreTable} bs, ${userTable} u 
                        WHERE bs.profileImg != 'NULL' 
                        AND bs.shortIntro1 != 'NULL' 
                        AND userIdx = ${userIdx}
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showDetail: async (userIdx, bookstoreIdx) => {
        const bookmarkQuery = `SELECT * FROM ${bookmarksTable} WHERE bookstoreIdx = ${bookstoreIdx} AND userIdx = ${userIdx};`;
        const query = `select bs.*, i.image1, i.image2, i.image3 from ${bookstoreTable} bs, ${imagesTable} i, ${userTable} u
        where bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = ${bookstoreIdx} and u.userIdx = ${userIdx};`;

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
        const location = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1 from ${bookstoreTable} bs, ${imagesTable} i 
                        WHERE bs.sectionIdx = ${sectionIdx} 
                        AND bs.bookstoreIdx = i.bookstoreIdx;`;

        // checked된 책방만 seciton별로
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1 from bookstore bs, images i, bookmarks bm
        where bs.sectionIdx = ${sectionIdx} and bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = bm.bookstoreIdx and bm.userIdx = ${userIdx};`;

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
            console.log('select profile ERROR : ',err);
            throw err;
        }
    },
    searchByKeyword: async (keyword) => {
        //const match = 'bookstoreName, location, activity, shortIntro, shortIntro2, description, hashtag1, hashtag2, hashtag3';
        //const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        const query = `select bs.*, i.image1 from ${bookstoreTable} bs, ${imagesTable} i 
                        where bs.bookstoreIdx = i.bookstoreIdx 
                        and (binary bs.bookstoreName like "%${keyword}%" 
                        or binary location like "%${keyword}%" 
                        or binary activity like "%${keyword}%" 
                        or binary shortIntro like "%${keyword}%" 
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
}

module.exports = bookstore;