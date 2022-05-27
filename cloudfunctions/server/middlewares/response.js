const response = () => {
    return async(ctx, next) => {
        ctx.res.fail = ({ code, data, message }) => {
            ctx.body = {
                code,
                data,
                message,
            };
        };

        ctx.res.success = message => {
            let data = ctx.body;
            try {
                data = JSON.parse(data)
            } catch (error) {
                data = ctx.body
            }
            ctx.body = {
                code: 0,
                data,
                message: message || 'success',
            };
        };

        await next();
    };
};

module.exports = response;