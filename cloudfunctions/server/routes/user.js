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

});

router.get("/info", function(ctx, next) {
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = {
        data: {
            roles: ["admin"],
            introduction: "I am a super administrator",
            avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name: "Super Admin",
        }
    };

});

router.post("/logout", function(ctx, next) {
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = "success"

});

module.exports = router;