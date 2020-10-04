const pool = require('../modules/pool');
const userTable = 'user';
const bookstoreTable ='bookstore';
const imagesTable ='images';

const user = {
    signup: async (nickname, email, hashed, salt) => {
        const fields = 'nickname, email, hashed, salt';
        const questions = `?, ?, ?, ?`;
        const values = [nickname, email, hashed, salt];
        const query = `INSERT INTO ${userTable}(${fields}) VALUES(${questions})`;
        try {
            //쿼리문 실행, 테이블에 회원 정보 기입하기 
            const result = await pool.queryParamArr(query, values);
            const userIdx = result.insertId;
            return userIdx;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },
    socialsignup: async (nickname, id, refreshToken, accessToken) => {
        const fields = 'nickname, id, refreshToken, accessToken';
        const questions = `?, ?, ?, ?`;
        const values = [nickname, id, refreshToken, accessToken];
        const query = `INSERT INTO ${userTable}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },
    checkUserByNickname: async(nickname)=>{
        const query = `select * from ${userTable} where nickname='${nickname}';`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            if (err.errno == 1062) {
                console.log('checkUserByNickname ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('checkUserByNickname ERROR : ',err);
            throw err;
        }
    },
    checkAccount : async(userIdx)=>{
        const query = `select * from ${userTable} where userIdx ='${userIdx}';`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('checkAccount ERROR : ',err);
            throw err;
        }
    },
    checkUserByEmail: async (email) => {
        // 현재 있는 회원인지 확인
        const query = `SELECT * FROM ${userTable} WHERE email = '${email}';`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkUser ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    checkUserById: async (id) => {
        const query = `SELECT * FROM ${userTable} WHERE id = '${id}';`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkUser ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    updateProfile: async (userIdx, profile) => {
        let query = `UPDATE ${userTable} SET profileImg = '${profile}' WHERE userIdx = ${userIdx}`;
        try {
            await pool.queryParam(query);
            query = `SELECT userIdx, nickname, email, profileImg FROM ${userTable} WHERE userIdx = ${userIdx}`;
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update profile ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update profile ERROR : ', err);
            throw err;
        }
    },
    updateImages: async(bookstoreIdx, locations)=>{
        let query = `insert into ${imagesTable} (bookstoreIdx, image1, image2, image3) values (${bookstoreIdx},'${locations[0]}','${locations[1]}','${locations[2]}')`;
        try{
            await pool.queryParam(query);
            query=`select * from ${imagesTable} where bookstoreIdx=${bookstoreIdx}`;
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            if(err.code === 'ER_DUP_ENTRY'){
                console.log('insert image Duplicate ERR : ',err);
                return '해당 서점의 이미지는 이미 등록되어있습니다.';
            }else{
                console.log('insert image ERR : ',err);
                throw err;
            }
        }
    },
    findUserByEmail: async(userEmail)=>{
        const query = `select nickname from ${userTable} where email=${userEmail}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('find user by email ERR : ',err);
            throw err;
        }
    },
    updateNewPW: async(email, newhashed, newsalt)=>{
        const query = `update ${userTable} set hashed='${newhashed}', salt='${newsalt}' where email='${email}'`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('update pw by email ERR : ',err);
            throw err;
        }
    },
    getUserIdxByEmail: async(email)=>{
        const query = `select * from ${userTable} where email='${email}'`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get userIdx by email ERR : ', err);
            throw err;
        }
    },
    getUserIdxById: async(id)=>{
        const query = `select * from ${userTable} where id='${id}'`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get userIdx by email ERR : ', err);
            throw err;
        }
    },
    getRefreshTokenByUserIdx: async(userIdx)=>{
        const query = `select refreshToken from ${userTable} where userIdx = ${userIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get refreshToken by userIdx ERR : ', err);
            throw err;
        }
    },
    checkIsLogined: async (email) => {
        const query = `SELECT is_logined FROM ${userTable} WHERE email = '${email}'`;
        try {
            const result = await pool.queryParam(query);
            return result[0].is_logined;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update islogined ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update islogined ERROR : ', err);
            throw err;
        }
    },
    updateIsLogined: async (email) => {
        const query = `UPDATE ${userTable} SET is_logined = 1 WHERE email = '${email}'`;
        try {
            await pool.queryParam(query);
            const result = 1;
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update islogined ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update islogined ERROR : ', err);
            throw err;
        }
    }
}

module.exports = user;
