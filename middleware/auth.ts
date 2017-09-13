export default function () {
    return function (ctx, next) {
        if (ctx.session && ctx.session.accountId) {
            return next();
        }

        ctx.status = 401;
    };
};