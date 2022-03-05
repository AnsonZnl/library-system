const router = require("koa-router")();

router.prefix("/feedback");

const tcb = require("./../config/tcb");

const db = tcb.database();
const feedbackDB = db.collection("feedbacks");
const studentDB = db.collection("students");

const _ = db.command;
const $ = db.command.aggregate;

router.get("/", function(ctx, next) {
    ctx.body = "this is a feedbacks response!";
});
// 增
router.post("/add", async function(ctx, next) {
    let { uid, username, title, content, account } = ctx.request.body;

    let data = await studentDB.where({ _id: uid })
    if (data.length == 0) {
        ctx.body = {
            code: 20001,
            message: "用户未注册",
        };
        ctx.status = 200;
    } else {
        await feedbackDB.add({
            createTime: Date.now(),
            uid,
            username,
            title,
            content,
            account,
        });

        ctx.body = {
            code: 20000,
            message: "success",
        };
        ctx.status = 200;
    }

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
    let res = await feedbackDB.where(body).skip(page).limit(size).get();
    let count = await feedbackDB.where(body).count();
    ctx.body = {
        code: 20000,
        data: { list: res.data, total: count.total },
    };
    ctx.status = 200;
});

// 删
router.get("/remove", async function(ctx, next) {
    let { id } = ctx.request.query;
    // 删一条 基于_id 去删除
    const res = await feedbackDB.doc(id).remove();
    ctx.body = {
        code: 20000,
        data: res.data,
    };
    ctx.status = 200;
});
module.exports = router;