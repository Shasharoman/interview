import * as Promise from 'bluebird'
import * as _ from 'lodash'
import * as fs from 'fs'
import * as lib from './lib'
import * as path from 'path'
import {AppManage} from './core'

process.env.framework = __dirname;

const config = loadConfig();
const appManage = new AppManage();

export const common = config.commonPath ? require(path.join(config.distDir, config.commonPath)) : {init: Promise.resolve}

export const mysql = lib.mysql;
export const mongo = lib.mongo;

lib.init(config).then(function () {
    return common.init();
}).then(function () {
    return appManage.setupMiddleware(config.middleware);
}).then(function () {
    return appManage.setupApp(_.map(config.apps, function (item) {
        return {
            name: item,
            path: path.join(config.appBaseDir, item),
            distPath: path.join(config.appDistDir, item)
        };
    }));
}).then(function (koa) {
    koa.listen(config.listen.port, config.listen.ip);
});

function loadConfig() {
    let params = {
        config: '-c'
    };
    let argNames = _.values(params);

    _.each(process.argv, function (item, index) {
        if (!_.includes(argNames, item)) {
            return;
        }
        let key = _.findKey(params, value => {
            return value === item;
        });
        params[key] = process.argv[index + 1];
    });

    return JSON.parse(fs.readFileSync(params.config).toString());
}