const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require("koa-cors");
const index = require('./routes/index')
const user = require('./routes/user')
const books = require("./routes/books");
const student = require("./routes/student");
const feedback = require("./routes/feedback");
const notice = require("./routes/notice");
// error handler
onerror(app)
app.use(cors());
// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(books.routes(), books.allowedMethods());
app.use(student.routes(), student.allowedMethods());
app.use(feedback.routes(), feedback.allowedMethods());
app.use(notice.routes(), notice.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app