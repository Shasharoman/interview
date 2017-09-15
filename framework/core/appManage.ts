import * as Koa from 'koa'
import * as fs from 'fs'
import * as Promise from 'bluebird'
import * as middleware from '../middleware'
import * as _ from 'lodash'
import * as path from 'path'

import {App} from './app'

class AppManage {
    private koa;

    constructor() {
        this.koa = new Koa();
    }

    public setupMiddleware(items): Promise {
        const self = this;

        return Promise.each(items, function (item) {
            if (_.isString(item)) {
                return self.koa.use(middleware[item]());
            }

            return self.koa.use(middleware[item.name](item.options));
        });
    }

    public setupApp(items): Promise {
        const self = this;

        items = _.map(items, function (item) {
            item.manifest = JSON.parse(fs.readFileSync(path.join(item.path, 'manifest.json')).toString());
            item.controller = require(path.join(item.distPath, item.manifest.controller || 'controller'));

            item.manifest.api = _.map(item.manifest.api, function (api) {
                api.impl = _.get(item.controller, api.impl);

                api.middleware = _.map(api.middleware, function (one) {
                    one = _.isString(one) ? {name: one} : one;
                    return middleware[one.name](one.options);
                });

                return api;
            });

            item.manifest.middleware = _.map(item.manifest.middleware, function (one) {
                one = _.isString(one) ? {name: one} : one;
                return middleware[one.name](one.options);
            });

            return item;
        });

        return Promise.each(items, function (item) {
            return new App(self.koa, item.manifest).init();
        }).then(function () {
            return Promise.resolve(self.koa);
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err.toString());
        });
    }
}

export {AppManage}