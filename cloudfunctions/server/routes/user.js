const router = require("koa-router")();

router.prefix("/user");

router.get("/", function(ctx, next) {
    ctx.body = "this is a users response!";
});

router.post("/login", function(ctx, next) {
    // ctx.body = ctx.request.body;
    let { password, username } = ctx.request.body;
    console.log({ password, username });
    ctx.body = "this is a users/bar response";
    ctx.status = 200;
});

module.exports = router;