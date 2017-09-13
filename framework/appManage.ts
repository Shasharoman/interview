import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import {App} from './app';
import {Common} from '../common';

export namespace AppManage {
    export const koa = new Koa();

    export function setupMiddleware(): Promise {
        const middleware = require(path.join(Common.config.distDir, 'middleware'));

        return Promise.each(Common.config.middleware, function (name: string) {
            return koa.use(middleware[name]({
                config: Common.config
            }));
        });
    }

    export function setupApp(): Promise {
        return Promise.each(Common.config.apps, function (appName: string) {
            let filePath = path.join(Common.config.appBaseDir, appName, 'manifest.json');
            let manifest = JSON.parse(fs.readFileSync(filePath).toString());

            return new App(koa, manifest, Common.config).init();
        }).then(function () {
            koa.listen(Common.config.listen.port, Common.config.listen.ip || '0.0.0.0');
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err.toString());
        });
    }
}