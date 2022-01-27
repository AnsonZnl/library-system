const router = require("koa-router")();

const { end } = require("cheerio/lib/api/traversing");
const tcb = require("./../config/tcb");
const { genBooksId, getBookInfo } = require("./../utils");
const db = tcb.database();
const booksDB = db.collection("booksList");
const studentDB = db.collection("students");
const _ = db.command;
const $ = db.command.aggregate;

router.prefix("/books");
router.get("/", function(ctx, next) {
    ctx.body = "this is a books response!";
});

// 增
router.post("/add", async function(ctx, next) {
    ctx.body = ctx.request.body;
    let {
        name,
        isbn,
        summary,
        bookClass,
        images,
        rate,
        tag,
        shelfNumber,
        author,
        price,
        doubanUrl,
        publisher,
        stock,
    } = ctx.request.body;
    await booksDB.add({
        id: genBooksId(22),
        createTime: Date.now(),
        images,
        publisher,
        doubanUrl,
        name,
        rate,
        tag,
        isbn,
        summary,
        bookClass,
        shelfNumber,
        author,
        price,
        stock,
        // 当前书籍的状态
        status: {
            statusCode: 1, // 1=空闲，2=借阅申请中，3=借阅中，4=还书申请中
            userId: "", // 借阅的用户ID。
            startDate: "",
            endDate: "",
        },
    });

    /*
                                                                                                                                                                              1=书籍空闲
                                                                                                                                                                              学生申请借书（学生ID，书籍ID，借书日期，还书日期）
                                                                                                                                                                              2=借阅申请
                                                                                                                                                                              管理员审批后
                                                                                                                                                                              3=借阅中
                                                                                                                                                                              学员申请还书
                                                                                                                                                                              4=还书申请中
                                                                                                                                                                              管理员审批后
                                                                                                                                                                              1=书籍空闲
                                                                                                                                                                              

                                                                                                                                                                      */
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
    console.log("====", _id, body);
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
// 借书
router.post("/borrow", async function(ctx, next) {
    let body = ctx.request.body;
    // console.log();
    let { userid, bookid, startDate, endDate, username, bookname, account } =
    body;

    let end = +new Date(endDate);
    let start = +new Date(startDate);
    let borrowDay = (end - start) / 1000 / 60 / 60 / 24;

    console.log("====", body);
    let book = await studentDB.where({ _id: userid }).get();
    let user = await booksDB.where({ _id: bookid }).get();
    console.log(body);
    let bookData = book.data[0];
    let userData = user.data[0];

    // 改用户状态
    let setData = {
        code: 2, // 申请中
        userid,
        bookid,
        borrowDay,
        account,
        startDate,
        endDate,
        username,
        bookname,
    };
    await studentDB.doc(userid).update({
        info: {
            borrwo: _.push(setData),
        },
    });
    await booksDB.doc(bookid).update({
        status: _.set(setData),
    });
    // 改书籍状态

    ctx.body = {
        code: 20000,
        data: {
            bookData,
            userData,
        },
    };
    ctx.status = 200;
});
// 借书列表

router.get("/borrowList", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    let body = ctx.request.body; // 查询条件
    size = Number(size);
    page = (Number(page) - 1) * size;
    // console.log("====", query);
    // let book = await studentDB.where({ _id: userid }).get();
    // 申请中的书
    let book = await booksDB
        .where({
            status: {
                code: 2,
            },
        })
        .skip(page)
        .limit(size)
        .get();

    let count = await booksDB
        .where({
            status: {
                code: 2,
            },
        })
        .count();
    // let user = await studentDB
    //     .aggregate()
    //     .project({
    //         username: 1,
    //         "info.borrwoCount": 1,
    //         "info.borrwo": $.filter({
    //             input: "$info.borrwo",
    //             as: "item",
    //             cond: $.gte(["$$item.code", 2]),
    //         }),
    //     })
    //     .end();
    // let arr = [...user.data];
    // let userdata = [];
    // for (let i = 0; i < arr.length; i++) {
    //     const e = arr[i];
    //     if (e.info.borrwo.length == 0) {
    //         e.isEmpty = true;
    //     } else {
    //         userdata.push(e);
    //         e.isEmpty = false;
    //     }
    // }

    ctx.body = {
        code: 20000,
        data: { list: book.data, total: count.total },
    };
    ctx.status = 200;
});
// 还书
router.post("/rturn", async function(ctx, next) {
    let body = ctx.request.body;
    let _id = body._id;
    delete body._id;
    console.log("====", _id, body);
    let res = await booksDB.doc(_id).update(body);
    // console.log(_id, res, body);
    ctx.body = {
        code: 20000,
        data: "success",
    };
    ctx.status = 200;
});
module.exports = router;