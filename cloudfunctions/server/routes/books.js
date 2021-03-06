const router = require("koa-router")();


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
            code: 1, // 申请中
            userid: "",
            bookid: "",
            borrowDay: "",
            account: "",
            startDate: "",
            endDate: "",
            username: "",
            bookname: "",
        },
    });

    /*
    1=书籍空闲
    读者申请借书（读者ID，书籍ID，借书日期，还书日期）
    2=借阅申请
    管理员审批后
    3=借阅中
    学员申请还书
    4=还书申请中
    管理员审批后
    1=书籍空闲
    5=已归还
*/
    ctx.body = "success"

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
                code: 1, // 0=空闲，1=借阅
            },
        },
        bookinfo
    );
    console.log("data", data);
    // await booksDB.add(data)
    ctx.body = data

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
    ctx.status = 200
    ctx.body = 'ok'
});
// 改
router.post("/update", async function(ctx, next) {
    let body = ctx.request.body;
    let _id = body._id;
    delete body._id;
    console.log("====", _id, body);
    let res = await booksDB.doc(_id).update(body);
    // console.log(_id, res, body);
    ctx.body = "success"
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
    ctx.body = { list: res.data, total: count.total }

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
    let bookData = book.data[0];
    let userData = user.data[0];

    // 改用户状态
    let setData = {
        borrwoId: genBooksId(30),
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

    ctx.body = {
        bookData,
        userData,
    }

});
// 借书列表
router.get("/borrowList", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    // let body = ctx.request.body; // 查询条件
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

    ctx.body = { list: book.data, total: count.total }


});
// 批准借书
router.post("/isPassBorrow", async function(ctx, next) {
    let { isPass, userid, bookid, id } = ctx.request.body; // 页数
    // isPass = 3 = 批准
    // isPss = 1 = 拒绝
    let user = await studentDB.where({ _id: userid }).get();
    let book = await booksDB.where({ _id: bookid }).get();
    let bookData = book.data[0];
    let userData = user.data[0];
    console.log("bookData", bookData);
    // 改书籍状态
    let setData = bookData.status;
    setData.code = isPass;
    await booksDB.doc(bookid).update({
        status: _.set(setData),
    });
    let bList = userData.info.borrwo;
    bList.forEach((e) => {
        if (e.borrwoId == id) {
            e.code = isPass;
        }
    });
    // 改用户状态
    await studentDB.doc(userid).update({
        info: {
            borrwo: _.set(bList),
            borrwoCount: isPass == 3 ? userData.info.borrwoCount - 1 : userData.info.borrwoCount,
        },
    });
    ctx.body = {
        setData,
        bList,
    };

});
// 借书列表
router.get("/returnList", async function(ctx, next) {
    let { page, size } = ctx.request.query; // 页数
    // let body = ctx.request.body; // 查询条件
    size = Number(size);
    page = (Number(page) - 1) * size;

    // 待还中的书
    let book = await booksDB
        .where({
            status: {
                code: 4,
            },
        })
        .skip(page)
        .limit(size)
        .get();

    let count = await booksDB
        .where({
            status: {
                code: 4,
            },
        })
        .count();

    ctx.body = { list: book.data, total: count.total }


});
// 拒绝还书
router.post("/isPassReturn", async function(ctx, next) {
    let { isPass, userid, bookid, id } = ctx.request.body; // 页数
    // isPass = 1 = 批准
    // isPss = 3 = 拒绝
    let user = await studentDB.where({ _id: userid }).get();
    let book = await booksDB.where({ _id: bookid }).get();
    let bookData = book.data[0];
    let userData = user.data[0];
    console.log("bookData", bookData);
    // 改书籍状态
    let setData = bookData.status;
    setData.code = isPass;
    await booksDB.doc(bookid).update({
        status: _.set(setData),
    });
    let bList = userData.info.borrwo;
    bList.forEach((e) => {
        if (e.borrwoId == id) {
            e.code = isPass;
        }
    });
    // 改用户状态
    await studentDB.doc(userid).update({
        info: {
            borrwo: _.set(bList),
            borrwoCount: isPass == 3 ? userData.info.borrwoCount - 1 : userData.info.borrwoCount,
        },
    });
    ctx.body = {
        setData,
        bList,
    }

});
// 还书
router.post("/return", async function(ctx, next) {
    let body = ctx.request.body;
    // console.log();
    let { userid, bookid, id } = body;

    console.log("====", body);
    let user = await studentDB.where({ _id: bookid }).get();
    let book = await booksDB.where({ _id: userid }).get();
    console.log("user", user, "book", book);
    let bookData = book.data[0];
    let userData = user.data[0];
    // 改书籍状态
    let setData = bookData.status;
    setData.code = 4;
    await booksDB.doc(bookid).update({
        status: _.set(setData),
    });
    let bList = userData.info.borrwo;
    bList.forEach((e) => {
        if (e.borrwoId == id) {
            e.code = 4;
        }
    });

    // 改用户状态
    await studentDB.doc(bookid).update({
        info: {
            borrwo: _.set(bList),
        },
    });
    // 改书籍状态
    await booksDB.doc(userid).update({
        status: _.set(setData),
    });

    ctx.body = {
        bookData,
        userData,
    };

});
module.exports = router;