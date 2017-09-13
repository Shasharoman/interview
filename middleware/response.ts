export default function () {
    return function (ctx, next) {
        let headers = {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache'
        };

        ctx.success = function (data) {
            ctx.set(headers);
            ctx.body = JSON.stringify({
                code: 0,
                result: data || 'ok'
            });
            ctx.status = 200;
        };

        ctx.fail = function (data) {
            console.log(data);

            ctx.set(headers);
            ctx.body = JSON.stringify({
                code: 1,    // todo error code impl
                result: data || 'fail'
            });
            ctx.status = 200;
        };

        return next();
    };
};