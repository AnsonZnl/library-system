const router = require("koa-router")();

router.prefix("/notice");

const tcb = require("./../config/tcb");

const db = tcb.database();
const noticesDB = db.collection("notices");

const _ = db.command;
const $ = db.command.aggregate;

router.get("/", function(ctx, next) {
    ctx.body = "this is a notices response!";
});
// 增
router.post("/add", async function(ctx, next) {
    let { title, content } = ctx.request.body;
    await noticesDB.add({
        createTime: Date.now(),
        isShow: false,
        title,
        content,
    });
    ctx.body = "success"

});

// 查
router.post("/list", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    let body = ctx.request.body; // 查询条件
    size = Number(size);
    page = (Number(page) - 1) * size;
    console.log("query", body, page, size);
    Object.keys(body).forEach((e) => {
        if (body[e] == "") delete body[e];
    });
    console.log(body);
    let res = await noticesDB.where(body).skip(page).limit(size).get();
    let count = await noticesDB.where(body).count();
    ctx.body = {
        list: res.data,
        total: count.total
    };

});

// 设置显示
router.get("/show", async function(ctx, next) {
    let { id } = ctx.request.query;

    await noticesDB.where({}).update({
        isShow: false,
    });
    const res = await noticesDB.doc(id).update({
        isShow: true,
    });

    ctx.body = {...res.data }


});

// 读者端，得到公告
router.get("/get", async function(ctx, next) {
    const res = await noticesDB
        .where({
            isShow: true,
        })
        .get();

    ctx.body = res.data[0]

});

// 删
router.get("/remove", async function(ctx, next) {
    let { id } = ctx.request.query;
    // 删一条 基于_id 去删除
    const res = await noticesDB.doc(id).remove();
    ctx.body = 'ok'

});
module.exports = router;