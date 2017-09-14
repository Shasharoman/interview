import * as session from 'koa-generic-session'
import * as redisStore from'koa-redis'
import * as _ from 'lodash'

let defaultOptions = {
    host: 'localhost',
    port: 6379
};

export default function (options) {
    return session({
        store: redisStore(_.assign(defaultOptions, options.config.redis)),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 604800000,  // a week in ms
            rewrite: true,
            signed: false
        }
    });
};