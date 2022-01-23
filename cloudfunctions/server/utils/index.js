const { getBookInfo } = require('./getDouBookInfo')

function genBooksId(num) {
    var returnStr = "",
        charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < num; i++) {
        var index = Math.round(Math.random() * (charStr.length - 1));
        returnStr += charStr.substring(index, index + 1);
    }
    return returnStr;
}

module.exports = {
    genBooksId,
    getBookInfo,
};