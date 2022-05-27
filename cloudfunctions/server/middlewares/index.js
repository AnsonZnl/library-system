/**
 * 引入第三方插件
 */
// const koaBody = require('koa-bodyparser');

/**
 * 引入自定义文件
 */
// const router = require('../routes/index');
// const formidable = require('./formidable');
const response = require('./response');
const error = require('./error');

/**
 * 参数解析
 * https://github.com/koajs/bodyparser
 */
// const mdFormidable = formidable();
// const mdKoaBody = koaBody({
//     enableTypes: ['json', 'form', 'text', 'xml'],
//     formLimit: '56kb',
//     jsonLimit: '1mb',
//     textLimit: '1mb',
//     xmlLimit: '1mb',
//     strict: true
// });

/**
 * 统一返回格式
 */
const mdResHandler = response();
/**
 * 错误处理
 */
const mdErrorHandler = error();

/**
 * 路由处理
 */
// const mdRoute = router.routes();
// const mdRouterAllowed = router.allowedMethods();

module.exports = [
    mdResHandler,
    mdErrorHandler,
    // mdFormidable,
    // mdKoaBody,
    // mdRoute,
    // mdRouterAllowed
];