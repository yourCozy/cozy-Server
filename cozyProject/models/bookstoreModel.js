
const pool = require('../modules/pool');
const e = require('express');
const bookstoreTable = 'bookstore';
// const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const tasteTable = 'taste';

const bookstore = {
    showRecommendation: async () => {

        // TODO: 사용자별로 취향에 따라 검색, 북마크 여부 추가
        // const userQuery =  `SELECT bookstores FROM ${tasteTable} WHERE userIdx = ${userIdx}`;

        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.mainImg, bs.shortIntro1, bs.shortIntro2, bs.location, bs.hashtag1, bs.hashtag2, bs.hashtag3 FROM ${bookstoreTable} bs
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
                        // bs.profileImg != 'NULL' AND bs.shortIntro1 != 'NULL' 나중에 추가해주기
        try {
            // const userResult = await pool.queryParam(userQuery);
            // console.log('userResult: ', userResult[0].bookstores);
            const result = await pool.queryParam(query);
            result.forEach(e => {
                e.checked = 0;
            });
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
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
        // tastesArray = tastes.split('/'); // x
        console.log(tastesArray);
        let count = 0;

        /**
         * select bookstoreIdx, bookstoreName, activities from cozy.bookstore
            where activities like '%공연%' or activities like '%전시%'
            or bookstoreName like '%놀이터%';  
         */

        let strQuery = '';
        let fields = ['bookstoreName', 'activities'];
        // 추후 필드 책방 이름이 아니라 해시태크로 변경
        let result = '';

        try {
            for (var taste in tastesArray) {
                strQuery = `SELECT bookstoreIdx, bookstoreName, activities FROM ${bookstoreTable} WHERE `;
                count = 0;
                for (var field in fields) {
                    if (count === 0) {
                        strQuery = strQuery + `${fields[field]} LIKE '%${tastesArray[taste]}%'`;
                    }
                    else {
                        strQuery = strQuery + ` OR ${fields[field]} LIKE '%${tastesArray[taste]}%'`;
                    }
                    count++;
                }
                // strQuery = strQuery + ` LIMIT 8`;
                result = await pool.queryParam(strQuery);
                // console.log(strQuery);

                let countQuery = '';
                for (var i of result){
                    // console.log(i.bookstoreIdx);
                    countQuery = `UPDATE ${bookstoreTable} SET tasteCount = tasteCount + 1 WHERE bookstoreIdx = ${i.bookstoreIdx}`
                    await pool.queryParam(countQuery);
                }
            }
            const bookmarkQuery = `SELECT * FROM ${bookmarksTable} WHERE userIdx = ${userIdx}`;
            const bookmarkResult = await pool.queryParam(bookmarkQuery);
            console.log(bookmarkResult);
            let query = `SELECT bookstoreIdx, bookstoreName, mainImg, shortIntro1, shortIntro2, location, hashtag1, hashtag2, hashtag3 FROM ${bookstoreTable} WHERE tasteCount > 0 ORDER BY tasteCount DESC LIMIT 8`;
            result = await pool.queryParam(query);

            for (var i in result) {
                let checked = 0;
                console.log('i: ', i);
                console.log('bookmarkResult[i]: ', bookmarkResult[i]);
                console.log(result[0].bookstoreIdx);
                for (var e in bookmarkResult) {
                    if (bookmarkResult[e].bookstoreIdx === result[i].bookstoreIdx) {
                        checked = 1;
                        break;
                    }
                }
                result[i].checked = checked;
            }
            // let query = `SELECT bookstoreIdx, bookstoreName, activities FROM ${bookstoreTable} WHERE tasteCount > 0 ORDER BY tasteCount DESC LIMIT 8`;
            // result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('order by tastes ERROR : ', err);
            throw err;
        }
    },
    updateTasteCountToZero: async (req, res) => {
        const query = `UPDATE ${bookstoreTable} SET tasteCount = 0 WHERE tasteCount > 0`;
        try {
            await pool.queryParam(query);
            return 1;
        } catch (err) {
            console.log('update tasteCount to zero ERROR : ', err);
            throw err;
        }
    },

    showDetail: async (userIdx, bookstoreIdx) => {
        const bookmarkQuery = `SELECT * FROM ${bookmarksTable} WHERE bookstoreIdx = ${bookstoreIdx} AND userIdx = ${userIdx};`;
        const query = `select bs.bookstoreIdx, bs.bookstoreName, bs.mainImg, bs.profileImg, bs.notice, bs.hashtag1, bs.hashtag2, bs.hashtag3, 
                        bs.tel, bs.location, bs.latitude, bs.longitude, bs.businessHours, bs.dayoff, bs.activities 
                        from ${bookstoreTable} bs, ${userTable} u
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
            console.log('show detail ERROR : ', err);
            throw err;
        }
    },
    showDetailForAny: async (bookstoreIdx) => {
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.mainImg, bs.profileImg, bs.notice, bs.hashtag1, bs.hashtag2, bs.hashtag3, 
                        bs.tel, bs.location, bs.latitude, bs.longitude, bs.businessHours, bs.dayoff, bs.activities
                        FROM ${bookstoreTable} bs WHERE bs.bookstoreIdx = ${bookstoreIdx}`;
        try {
            const result = await pool.queryParam(query);
            result[0].checked = 0;
            return result;
        } catch (err) {
            console.log('showDetailForAny ERROR : ', err);
            throw err;
        }
    },
    showBookstoreFeed: async (bookstoreIdx) => {
        const query = `SELECT bookstoreIdx, image1, image2, image3, description 
                        FROM ${bookstoreTable} WHERE bookstoreIdx = ${bookstoreIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showBookstoreFeed ERROR : ', err);
            throw err;
        }
    },
    showBookstoresBySection: async (userIdx, sectionIdx) => {
        // location section별로
        const location = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.location, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.mainImg from ${bookstoreTable} bs
                        WHERE bs.sectionIdx = ${sectionIdx};`;

        // checked된 책방만 seciton별로
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.mainImg from bookstore bs, bookmarks bm
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
                // locationResult[a].count = locationResult.length;
            }
            
            return locationResult;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('showBookstoresBySection ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('showBookstoresBySection ERROR : ', err);
            throw err;
        }
    },
    showBookstoresBySectionForAny: async (sectionIdx) => {
        // SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profileImg, bs.image1 from ${bookstoreTable} bs
        // WHERE bs.sectionIdx = ${sectionIdx};
        const query = `SELECT bookstoreIdx, bookstoreName, location, hashtag1, hashtag2, hashtag3, mainImg from ${bookstoreTable} 
                        WHERE sectionIdx = ${sectionIdx}`;
        try {
            const result = await pool.queryParam(query);
            result.forEach(element => {
                element.checked = 0;
            });
            return result;
        } catch (err) {
            console.log('showBookstoresBySectionForAny ERROR : ',err);
            throw err;
        }
    },
    showBookstoreNumber: async () => {
        const query = `SELECT sectionIdx, COUNT(bookstoreIdx) AS count 
                        FROM ${bookstoreTable} 
                        GROUP BY sectionIdx
                        ORDER BY sectionIdx`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('show BookstoreNumber ERROR : ',err);
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
    
}

module.exports = bookstore;