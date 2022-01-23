const router = require("koa-router")();
const tcb = require("./../config/tcb");
const { genBooksId, getBookInfo } = require("./../utils");
const db = tcb.database();
const booksDB = db.collection("booksList");
const _ = db.command;

router.prefix("/books");
router.get("/", function(ctx, next) {
    ctx.body = "this is a books response!";
});

// 增
router.post("/add", async function(ctx, next) {
    // name: string;
    // rate: any;
    // images: any;
    // doubanUrl: any;
    // summary: any;
    // tag: any[];
    // author: any;
    // publisher: any;
    // price: any;
    ctx.body = ctx.request.body;
    let { name, isbn, summary, bookClass, shelfNumber, author, price, stock } =
    ctx.request.body;
    await booksDB.add({
        id: genBooksId(22),
        createTime: Date.now(),
        name,
        isbn,
        summary,
        bookClass,
        shelfNumber,
        author,
        price,
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

// 添加豆瓣图书信息
router.get("/addDouBookInfo", async(ctx, next) => {
    let { isbn } = ctx.request.query;
    let bookinfo = await getBookInfo(isbn);
    console.log(bookinfo);
    let data = Object.assign({
            id: genBooksId(22),
            createTime: Date.now(),
            stock: 1,
            bookClass: bookinfo.tag[1],
            isbn,
            status: {
                code: 0, // 0=空闲，1=借阅
                userId: "", // 借阅的用户ID。
                startDate: "",
                endDate: "",
            },
        },
        bookinfo
    );
    console.log("data", data);
    // await booksDB.add(data)
    ctx.body = {
        code: 20000,
        data: data,
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
router.post("/update", async function(ctx, next) {
    let body = ctx.request.body;
    let _id = body._id;
    delete body._id;
    let res = await booksDB.doc(_id).update(body);
    // console.log(_id, res, body);
    ctx.body = {
        code: 20000,
        data: "success",
    };
    ctx.status = 200;
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