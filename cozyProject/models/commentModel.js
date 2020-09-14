const pool = require('../modules/pool');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const commentTable = 'comment';
const userTable = 'user';

const comment = {
    selectNickname: async (userIdx) => {
        let query = `SELECT * FROM ${userTable} WHERE userIdx = ${userIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('select Nickname ERROR : ', err);
            throw err;
        }
    },
    writeComment: async(userIdx, activityIdx, content)=>{
        // "20.09.12 23:30" // 우선 제플린 뷰대로 작성, 수정 은 뺐음.
        const date = moment().format('YY.MM.DD HH:mm');
        console.log(date);

        const fields = 'userIdx, activityIdx, content, createdAt';
        const questions = '?, ?, ?, ?';
        const values = [userIdx, activityIdx, content, date];
        
        // insert 같이 values 값 들어가는 것은 queryParamArr 함수 써주는 게 좋음~~
        const query = `INSERT INTO ${commentTable} (${fields}) VALUES (${questions})`;
        try{    
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        }catch(err){
            console.log('writeComment ERROR : ',err);
            throw err;
        }
    },
    showMyComment: async(userIdx) => {
        const query = `SELECT c.*, u.nickname FROM ${commentTable} c, ${userTable} u WHERE c.userIdx = u.userIdx AND c.userIdx = ${userIdx} ORDER BY commentIdx DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err) {
            if (err.errno == 1062) {
                console.log('show my comment ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('show my comment ERROR : ', err);
            throw err;
        }
    },
    checkComment: async(commentIdx)=>{
        const query = `SELECT * FROM ${commentTable} 
                        WHERE commentIdx = ${commentIdx};`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('check Comment ERROR : ',err);
            throw err;
        }
    },
    deleteComment: async(commentIdx)=>{
        const query = `delete from ${commentTable} where commentIdx=${commentIdx};`;
        try{
            await pool.queryParam(query);
            return 1;
            //return commentIdx;
        }catch(err){
            console.log('deleteComment ERROR : ',err);
            throw err;
        }
    },
    UpdateComment: async(commentIdx, content)=>{
        // 우선 제플린 뷰대로 수정은 뻈음. 
        const date = moment().format('YY.MM.DD HH:mm');
        const query = `update ${commentTable} set content = '${content}', createdAt = '${date}' where commentIdx = ${commentIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('Update Comment ERROR : ',err);
            throw err;
        }
    },
    showAllComment: async(activityIdx)=>{
        const query = `select c.*, u.nickname from ${commentTable} c, ${userTable} u where c.activityIdx = ${activityIdx} and c.userIdx = u.userIdx order by createdAt DESC`;
        //order by createAt 하면 시간이 저장되지 않아 약간의 오차 발생
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('Show All comment ERROR : ', err);
            throw err;
        }
    }
}

module.exports = comment;