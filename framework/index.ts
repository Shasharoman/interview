import * as Promise from 'bluebird'
import * as _ from 'lodash'
import * as fs from 'fs'
import * as lib from './lib'
import * as path from 'path'
import {appManage} from './core'

process.env.framework = __dirname;

const config = loadConfig();

export const common = config.commonPath ? require(path.join(config.distDir, config.commonPath)) : {init: Promise.resolve}

export const mysql = lib.mysql
export const mongo = lib.mongo

lib.init(config).then(function () {
    return common.init();
}).then(function () {
    return appManage.setupMiddleware(config);
}).then(function () {
    return appManage.setupApp(config);
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