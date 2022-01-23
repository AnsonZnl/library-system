const router = require("koa-router")();

router.prefix("/user");

router.get("/", function(ctx, next) {
    ctx.body = "this is a users response!";
});

router.post("/login", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    if (username == 'admin' && password == '111111') {
        ctx.body = {
            code: 20000,
            message: "success",
            data: {
                token: "admin-token",
            },
        };
    } else {
        ctx.body = {
            code: 20001,
            message: "账号密码错误"
        };
    }
    ctx.status = 200;
});

router.get("/info", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = {
        code: 20000,
        data: {
            roles: ["admin"],
            introduction: "I am a super administrator",
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name: "Super Admin",
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