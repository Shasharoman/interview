import * as Koa from 'koa'
import * as fs from 'fs'
import * as path from 'path'
import * as Promise from 'bluebird'

import {App} from './app'

export namespace appManage {
    export const koa = new Koa();

    export function setupMiddleware(config): Promise {
        const middleware = require(path.join(config.distDir, 'middleware'));

        return Promise.each(config.middleware, function (name: string) {
            return koa.use(middleware[name]({
                config: config
            }));
        });
    }

    export function setupApp(config): Promise {
        return Promise.each(config.apps, function (appName: string) {
            let filePath = path.join(config.appBaseDir, appName, 'manifest.json');
            let manifest = JSON.parse(fs.readFileSync(filePath).toString());

            return new App(koa, manifest, config).init();
        }).then(function () {
            koa.listen(config.listen.port, config.listen.ip || '0.0.0.0');
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err.toString());
        });
    }
}