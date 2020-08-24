const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';

const activity = {
    showActivitiesByCategory: async (userIdx, categoryIdx) => {
        const query = ``;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showActivitiesByCategory ERROR : ', err);
            throw err;
        }
    }
}

module.exports = activity;