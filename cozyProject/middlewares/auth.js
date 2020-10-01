const jwt = require('../modules/jwt');
const MSG = require('../modules/resMessage');
const CODE = require('../modules/statusCode');
const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        if (req.headers.token === undefined) {
            console.log("로그인하지 않은 사용자");
            next();
        } else {
            var token = req.headers.token;
            if (!token) {
                return res.json(util.fail(CODE.OK, MSG.EMPTY_TOKEN));
            }
            const user = await jwt.verify(token);
            if (user === TOKEN_EXPIRED) {
                return res.json(util.fail(CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN));
            }
            if (user === TOKEN_INVALID) {
                return res.json(util.fail(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            }
            if (user.userIdx === undefined) {
                return res.json(util.fail(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            }
            req.decoded = user;
            next();
        }
    }
}
module.exports = authUtil;