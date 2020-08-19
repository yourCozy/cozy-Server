const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const encrypt = require('../modules/crypto');
let passport = require('passport');

passport.use(new LocalStrategy(
    /* 
    - username: email
    - password: password 
    */
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (username, password, done)=>{
        const result = await User.checkUserByEmail(username);
        console.log('passport.js result : ', result);
        if(!result){
            console.log('사용자를 찾을 수 없습니다.');
            return done(null, false);
        }
        const hashed = await encrypt.encryptWithSalt(password, result[0].salt);
        if (hashed !== result[0].hashed) {
            console.log('비밀번호 오류');
            return done(null, false);
        }
        const dto = {
            userIdx: result[0].userIdx,
            nickname: result[0].nickname,
            email: result[0].email,
            profile: result[0].profile
        }
        done(null, dto);
        /*
        ( done의 두 번째 인자 !== false ) => passport.serializeUser 실행
        */
    }
));

passport.serializeUser(async(user, done)=>{
    console.log('serializeUser', user);
    done(null, user.userIdx);
});

passport.deserializeUser(async(userIdx, done)=>{
    console.log('deserializeUser', userIdx);
    return done(null, userIdx);
    /*
    const result = await User.findUserByEmail(email);
    console.log('deserializeUser', result);
    if(result){
        return done(null, result[0].userIdx);
    }
    done('There is no user.');
    */
})