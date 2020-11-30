var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/**
 * redis: Redis DB 사용
 * express-session: express에서 세션 관리하기 위한 라이브러리
 * connect-redis: redis DB를 세션 관리에 사용할 수 있도록 저장소를 연결시켜 줌.
 */
//var redis = require('redis');
var session = require('express-session');
//var redisStore = require('connect-redis')(session);

//const session = require('express-session');
//const MySQLStore = require('express-mysql-session')(session);
//const MySQLInfo = require('./config/database.json');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// /**
//  * redis 세션 관리
//  *  */
// // Redis 서버 연결 설정
// var client = redis.createClient(6379, 'localhost');

// app.use(session({
//   secret: 'SeCrEt',
//   // Redis 서버의 설정정보
//   store: new redisStore({
//     client: client,
//     ttl: 260
//   }),
//   saveUninitialized: false,
//   resave: false
// }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
/*
var options = {
  host: MySQLInfo.host,
  port: MySQLInfo.port,
  user: MySQLInfo.user,
  password: MySQLInfo.password,
  database: MySQLInfo.database
};
var sessionStore = new MySQLStore(options);

app.use(session({
  secret: '$SeCrEtKeY$',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
*/

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
