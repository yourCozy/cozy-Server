const pool = require('../modules/pool');
const table = 'user';
const table2 ='bookstore';
const table3 ='images';

const user = {
    signup: async (nickname, password, salt, email, refreshToken) => {
        const fields = 'nickname, hashed, salt, email, refreshToken';
        const questions = `?, ?, ?, ?, ?`;
        const values = [nickname, password, salt, email, refreshToken];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
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
    socialsignup: async (nickname, id, refreshToken) => {
        const fields = 'nickname, id, refreshToken';
        const questions = `?, ?, ?`;
        const values = [nickname, id, refreshToken];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
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
        const query = `select * from ${table} where nickname='${nickname}';`;
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
    checkUserByEmail: async (email) => {
        const query = `SELECT * FROM ${table} WHERE email = '${email}';`;
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
        const query = `SELECT * FROM ${table} WHERE id = '${id}';`;
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
        let query = `UPDATE ${table} SET profileImg = '${profile}' WHERE userIdx = ${userIdx}`;
        try {
            await pool.queryParam(query);
            query = `SELECT userIdx, nickname, email, profileImg FROM ${table} WHERE userIdx = ${userIdx}`;
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
        let query = `insert into ${table3} (bookstoreIdx, image1, image2, image3) values (${bookstoreIdx},'${locations[0]}','${locations[1]}','${locations[2]}')`;
        try{
            await pool.queryParam(query);
            query=`select * from ${table3} where bookstoreIdx=${bookstoreIdx}`;
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
        const query = `select nickname from ${table} where email=${userEmail}`;
        try{
            const result = pool.queryParam(query);
            return result;
        }catch(err){
            console.log('find user by email ERR : ',err);
            throw err;
        }
    },
    updateNewPW: async(email, newhashed, newsalt)=>{
        const query = `update ${table} set hashed='${newhashed}', salt='${newsalt}' where email='${email}'`;
        try{
            const result = pool.queryParam(query);
            return result;
        }catch(err){
            console.log('update pw by email ERR : ',err);
            throw err;
        }
    },
    getUserIdxByEmail: async(email)=>{
        const query = `select * from ${table} where email='${email}'`;
        try{
            const result = pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get userIdx by email ERR : ', err);
            throw err;
        }
    },
    getUserIdxById: async(id)=>{
        const query = `select * from ${table} where id='${id}'`;
        try{
            const result = pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get userIdx by email ERR : ', err);
            throw err;
        }
    },
    getRefreshTokenByUserIdx: async(userIdx)=>{
        const query = `select refreshToken from ${table} where userIdx = ${userIdx}`;
        try{
            const result = pool.queryParam(query);
            return result;
        }catch(err){
            console.log('get refreshToken by userIdx ERR : ', err);
            throw err;
        }
    }
}

module.exports = user;
