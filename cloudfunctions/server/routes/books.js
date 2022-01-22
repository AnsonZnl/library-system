const router = require("koa-router")();
const tcb = require("./../config/tcb");
const { genBooksId } = require("./../utils");
const db = tcb.database();
const booksDB = db.collection("booksList");
const _ = db.command;

router.prefix("/books");
router.get("/", function(ctx, next) {
    ctx.body = "this is a books response!";
});
// 增
router.post("/add", function(ctx, next) {
    ctx.body = ctx.request.body;
    let {
        name,
        isbn,
        descript,
        bookClass,
        shelfNumber,
        author,
        pressPrice,
        stock,
    } = ctx.request.body;
    booksDB.add({
        id: genBooksId(22),
        createTime: Date.now(),
        name,
        isbn,
        descript,
        bookClass,
        shelfNumber,
        author,
        pressPrice,
        stock,
        status: {
            code: 0, // 0=空闲，1=借阅
            userId: "", // 借阅的用户ID。
            startDate: "",
            endDate: "",
        },
    });

    ctx.body = {
        code: 20000,
        data: "success",
    };
    ctx.status = 200;
});

// 删
router.get("/remove", async function(ctx, next) {
    let { id } = ctx.request.query;
    // 删一条 基于_id 去删除
    const res = await booksDB.doc(id).remove();
    // 删多条
    // const res = await booksDB
    //     .where({
    //         stock: 5,
    //     })
    //     .remove();

    ctx.body = {
        code: 20000,
        data: res.data,
    };
    ctx.status = 200;
});
// 改
router.post("/update", function(ctx, next) {
    let { id } = ctx.query;
});
// 查
router.post("/query", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    let body = ctx.request.body; // 查询条件
    size = Number(size);
    page = (Number(page) - 1) * size;
    console.log("query", body, page, size);
    Object.keys(body).forEach((e) => {
        if (body[e] == "") delete body[e];
    });
    console.log(body);
    let res = await booksDB.where(body).skip(page).limit(size).get();
    let count = await booksDB.where(body).count();
    ctx.body = {
        code: 20000,
        data: { list: res.data, total: count.total },
    };
    ctx.status = 200;
});

module.exports = router;