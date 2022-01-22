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

router.post("/login", async function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username, account } = ctx.request.body;
    console.log({ password, username, account });
    await studentDB.add({
        username,
        password,
        account,
    });
    ctx.body = {
        code: 20000,
        message: "node error",
        data: {
            token: "admin-token",
        },
    };
    ctx.status = 200;
});

router.post("/register", async function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username, account } = ctx.request.body;
    console.log({ password, username, account });
    await studentDB.add({
        username,
        password,
        account,
        info: {
            borrwo: [], // 借书列表
            historyBorrwo: [], // 历史借书列表
            borrwoCount: 5, // 可借书数量
            historyBorrowNum: 0, // 历史借阅次数
            historyBorrowNum: 0, // 历史借阅次数
        },
    });
    ctx.body = {
        code: 20000,
        message: "success",
        data: {
            token: "student-token",
        },
    };
    ctx.status = 200;
});


router.get("/info", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = {
        code: 20000,
        data: {
            introduction: "I am a super administrator",
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name: "Super Admin",
            borrow: ['book id'],
            state: {
                count: 5, // 
            },
        },
    };
    ctx.status = 200;
});

router.post("/logout", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = {
        code: 20000,
        data: "success",
    };
    ctx.status = 200;
});

module.exports = router;