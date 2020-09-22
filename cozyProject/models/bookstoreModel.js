const pool = require('../modules/pool');
const e = require('express');
const { check } = require('../middlewares/session');
const bookstoreTable = 'bookstore';
// const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const bookstoreImgTable = 'bookstoreImg';
const userTable = 'user';
const tasteTable = 'taste';

const bookstore = {
    showRecommendation: async () => {

        // TODO: 사용자별로 취향에 따라 검색, 북마크 여부 추가
        // const userQuery =  `SELECT bookstores FROM ${tasteTable} WHERE userIdx = ${userIdx}`;
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.mainImg, bs.shortIntro1, bs.shortIntro2, bs.location, bs.hashtag1, bs.hashtag2, bs.hashtag3 FROM ${bookstoreTable} bs
                        WHERE bs.mainImg is not null
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
                        // bs.profileImg != 'NULL' AND bs.shortIntro1 != 'NULL' 나중에 추가해주기
        try {
            // const userResult = await pool.queryParam(userQuery);
            // console.log('userResult: ', userResult[0].bookstores);
            const result = await pool.queryParam(query);
            //const query2 = 'SELECT checked from ${bookmarksTable} where userIdx = ${userIdx}'
            result.forEach(e => {
                e.checked = 0;
            });
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showRecommendationByUser:async (userIdx)=>{
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.mainImg, bs.shortIntro1, 
                        bs.shortIntro2, bs.location, bs.hashtag1, bs.hashtag2, bs.hashtag3
                        FROM ${bookstoreTable} bs
                        WHERE bs.mainImg is not null
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
        const bookmarkQuery = `SELECT bookstoreIdx from ${bookmarksTable} where userIdx = ${userIdx};`;
        try{
            const result = await pool.queryParam(query);
            const bookmarkResult = await pool.queryParam(bookmarkQuery);
            
            for(var a in result){
                var checked=0;
                for(var b in bookmarkResult){
                    if(result[a].bookstoreIdx === bookmarkResult[b].bookstoreIdx){
                        checked=1;
                        break;
                    }
                }
                result[a].checked = checked;
                result[a].count = result.length;
            }
            return result;
        }catch(err){
            console.log('showRecommendationByUser ERROR : ', err);
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
        tastes = tastes.replace('/', ','); // / 를 , 로 치환 후 split
        let tastesArray = tastes.split(','); 
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
            // console.log(bookmarkResult);
            let query = `SELECT bookstoreIdx, bookstoreName, mainImg, shortIntro1, shortIntro2, location, hashtag1, hashtag2, hashtag3 FROM ${bookstoreTable} 
                        WHERE mainImg is not null
                        AND tasteCount > 0 ORDER BY tasteCount DESC LIMIT 8`;
            result = await pool.queryParam(query);

            for (var i in result) {
                let checked = 0;
                // console.log('i: ', i);
                // console.log('bookmarkResult[i]: ', bookmarkResult[i]);
                // console.log(result[0].bookstoreIdx);
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
        const query = `SELECT image1, text1, image2, text2, image3, text3, image4, text4, image5, text5, image6, text6, image7, text7 
                        FROM ${bookstoreImgTable} WHERE bookstoreIdx = ${bookstoreIdx}`;
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
                        WHERE bs.mainImg is not null
                        AND bs.sectionIdx = ${sectionIdx};`;

        // checked된 책방만 seciton별로
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.mainImg from bookstore bs, bookmarks bm
        WHERE bs.sectionIdx = ${sectionIdx} 
        AND bs.bookstoreIdx = bm.bookstoreIdx 
        AND bm.userIdx = ${userIdx};`;

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
                        WHERE mainImg is not null
                        AND sectionIdx = ${sectionIdx}`;
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
                        WHERE mainImg is not null
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
    searchByKeywordForAny: async (keyword) => {
        const fields = 'bs.bookstoreIdx, bookstoreName, mainImg, location, shortIntro1, shortIntro2, hashtag1, hashtag2, hashtag3';
        //const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        // 키워드 한 개 검색 가능, 특수문자 가능, 이모티콘 불가능
        const query = `SELECT ${fields} FROM ${bookstoreTable} bs, ${bookstoreImgTable} bi
                        WHERE bs.bookstoreIdx = bi.bookstoreIdx 
                        AND bs.mainImg is not null
                        AND (binary bs.bookstoreName like "%${keyword}%" 
                        or binary bs.location like "%${keyword}%" 
                        or binary bs.notice like "%${keyword}%" 
                        or binary bs.activities like "%${keyword}%" 
                        or binary bs.shortIntro1 like "%${keyword}%"
                        or binary bs.shortIntro2 like "%${keyword}%" 
                        or binary bs.hashtag1 like "%${keyword}%" 
                        or binary bs.hashtag2 like "%${keyword}%" 
                        or binary bs.hashtag3 like "%${keyword}%"
                        or binary bi.text1 like "%${keyword}%"
                        or binary bi.text2 like "%${keyword}%" 
                        or binary bi.text3 like "%${keyword}%" 
                        or binary bi.text4 like "%${keyword}%" 
                        or binary bi.text5 like "%${keyword}%" 
                        or binary bi.text6 like "%${keyword}%" 
                        or binary bi.text7 like "%${keyword}%")
                        order by bs.bookmark desc;`;
        // console.log('search query : ', query);

        try {
            const result = await pool.queryParam(query);
            for (var a in result) {
                result[a].checked = 0;
                result[a].count = result.length;
            }
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }                
    },
    searchByKeyword: async (userIdx, keyword) => {
        const fields = 'bs.bookstoreIdx, bookstoreName, mainImg, location, shortIntro1, shortIntro2, hashtag1, hashtag2, hashtag3';
        //const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        // 키워드 한 개 검색 가능, 특수문자 가능, 이모티콘 불가능
        const query = `SELECT ${fields} FROM ${bookstoreTable} bs, ${bookstoreImgTable} bi
                        WHERE bs.bookstoreIdx = bi.bookstoreIdx 
                        AND bs.mainImg is not null
                        AND (binary bs.bookstoreName like "%${keyword}%" 
                        or binary bs.location like "%${keyword}%" 
                        or binary bs.notice like "%${keyword}%" 
                        or binary bs.activities like "%${keyword}%" 
                        or binary bs.shortIntro1 like "%${keyword}%"
                        or binary bs.shortIntro2 like "%${keyword}%" 
                        or binary bs.hashtag1 like "%${keyword}%" 
                        or binary bs.hashtag2 like "%${keyword}%" 
                        or binary bs.hashtag3 like "%${keyword}%"
                        or binary bi.text1 like "%${keyword}%"
                        or binary bi.text2 like "%${keyword}%" 
                        or binary bi.text3 like "%${keyword}%" 
                        or binary bi.text4 like "%${keyword}%" 
                        or binary bi.text5 like "%${keyword}%" 
                        or binary bi.text6 like "%${keyword}%" 
                        or binary bi.text7 like "%${keyword}%")
                        order by bs.bookmark desc;`;
        // console.log('search query : ', query);

        const bookmarkQuery = `SELECT bookstoreIdx FROM ${bookmarksTable} WHERE userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            const bookmarkResult = await pool.queryParam(bookmarkQuery);

            for (var a in result) {
                var checked = 0;
                for (var b in bookmarkResult) {
                    if (result[a].bookstoreIdx === bookmarkResult[b].bookstoreIdx) {
                        checked = 1;
                        break;
                    }
                }
                result[a].checked = checked;
                result[a].count = result.length;
            }
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }
    }
    
}

module.exports = bookstore;