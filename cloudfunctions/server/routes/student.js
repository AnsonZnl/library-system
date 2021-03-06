const router = require("koa-router")();
const tcb = require("./../config/tcb");
const { genBooksId } = require("./../utils");
const db = tcb.database();
const studentDB = db.collection("students");
const _ = db.command;
router.prefix("/student");

router.get("/", function(ctx, next) {
    ctx.body = "this is a student response!";
});
// 登陆
router.post("/login", async function(ctx, next) {
    let { account, password } = ctx.request.body;
    console.log({ account, password });
    let res = await studentDB
        .where({
            account: account,
        })
        .get();

    let data = res.data[0];
    if (!data) {
        ctx.body = {
            code: 20001,
            message: "账号不存在",
        };
    } else if (data.password == password) {
        ctx.body = {
            message: "success",
            data: {
                token: "student-token",
                info: data,
            },
        };
    } else {
        ctx.body = {
            code: 20001,
            message: "账号密码错误",
        };
    }

});
// 注册
router.post("/register", async function(ctx, next) {
    let { password, username, account } = ctx.request.body;
    console.log({ username, account, password });
    await studentDB.add({
        username,
        account,
        password,
        createTime: Date.now(),
        info: {
            // 当前用户的借阅状态
            borrwo: [], // 借书列表
            borrwoCount: 5, // 可借书数量
        },
        // {
        //     code: 1, // 1=空闲，2=借阅申请中，3=借阅中，4=还书申请中
        //     bookId: "",
        //     startDate: "",
        //     endDate: "",
        // },
    });
    ctx.body = {
        message: "success",
        data: {
            token: "student-token",
        },
    };

});
// 查看
router.get("/info", async function(ctx, next) {
    let { _id } = ctx.request.query;
    let res = await studentDB.where({ _id }).get()
    ctx.body = res.data.length ? res.data[0] : []

});
// 列表
router.post("/list", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    let body = ctx.request.body; // 查询条件
    size = Number(size);
    page = (Number(page) - 1) * size;

    Object.keys(body).forEach((e) => {
        if (body[e] == "") delete body[e];
    });

    let res = await studentDB.where(body).skip(page).limit(size).get();
    let count = await studentDB.where(body).count();
    ctx.body = { list: res.data, total: count.total }

});
// 删除
router.get("/remove", async function(ctx, next) {
    let { id } = ctx.request.query;
    let res = await studentDB.doc(id).remove();
    ctx.body = 'ok'

});
module.exports = router;