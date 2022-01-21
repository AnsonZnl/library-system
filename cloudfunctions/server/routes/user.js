const router = require("koa-router")();

router.prefix("/user");

router.get("/", function(ctx, next) {
    ctx.body = "this is a users response!";
});

router.post("/login", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = {
        code: 20000,
        message: "node error",
        data: {
            token: "admin-token",
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
            roles: ["admin"],
            introduction: "I am a super administrator",
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name: "Super Admin",
        },
    };
    ctx.status = 200;
});

router.get("/logout", function(ctx, next) {
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