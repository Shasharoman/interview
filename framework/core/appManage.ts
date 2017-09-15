import * as Koa from 'koa'
import * as Promise from 'bluebird'
import * as middleware from '../middleware'
import * as _ from 'lodash'
import * as path from 'path'

import {App} from './app'

class AppManage {
    private koa;
    private apps = [];
    private serviceCache = {};

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
            item.manifest = self.trimManifest(item.manifest, item.path);

            return item;
        });

        return Promise.each(items, function (item) {
            return new App(item.name, item.manifest, self.koa).init();
        }).then(function (apps) {
            self.apps = apps;

            return Promise.resolve(self.koa);
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err.toString());
        });
    }

    public serviceCall(appName: string, serviceName: string): Promise {
        let args = _.slice(arguments, 2);

        if (this.serviceCache[appName] && _.isFunction(this.serviceCache[appName][serviceName])) {
            return this.serviceCache[appName][serviceName].apply(null, args);
        }

        const app = _.find(this.apps, function (app) {
            return app.name === appName;
        });
        if (_.isEmpty(app)) {
            return Promise.reject('service not found by appName: ' + appName);
        }

        const service = _.find(app.manifest.service, function (item) {
            return item.name === serviceName
        });
        if (_.isEmpty(service)) {
            return Promise.reject('service not found by serviceName: ' + serviceName);
        }

        if (!this.serviceCache[appName]) {
            this.serviceCache[appName] = {};
        }
        this.serviceCache[appName][serviceName] = service.impl;

        return this.serviceCache[appName][serviceName].apply(null, args);
    }

    private trimManifest(manifest, appPath): object {
        let controller = require(path.join(appPath, 'controller'));
        let service = require(path.join(appPath, 'service'));

        return _.assign({}, manifest, {
            api: _.map(manifest.api, function (api) {
                api.impl = _.get(controller, api.impl);
                api.middleware = _.map(api.middleware, function (one) {
                    one = _.isString(one) ? {name: one} : one;
                    return middleware[one.name](one.options);
                });

                return api;
            }),
            middleware: _.map(manifest.middleware, function (one) {
                one = _.isString(one) ? {name: one} : one;
                return middleware[one.name](one.options);
            }),
            service: _.map(manifest.service, function (item) {
                item.impl = _.get(service, item.impl);
                return item;
            })
        });
    }
}

export {AppManage}