import * as innerSession from 'koa-generic-session'
import * as redisStore from'koa-redis'
import * as _ from 'lodash'

let defaultStore = {
    host: 'localhost',
    port: 6379
};

export function session(options) {
    options = options || {};

    return innerSession({
        store: redisStore(_.assign(defaultStore, options.store)),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 604800000,  // a week in ms
            rewrite: true,
            signed: false
        }
    });
};