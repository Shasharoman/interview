import * as Promise from 'bluebird'
import * as lib from './lib'
import * as path from 'path'
import * as _ from 'lodash'
import {bootstrap} from './bootstrap'
import {config} from './config'

process.env.framework = __dirname;

export const common = config.commonPath ? require(path.join(config.distDir, config.commonPath)) : {init: Promise.resolve};
export const mysql = lib.mysql;
export const mongo = lib.mongo;

let appManage = {
    serviceCall: function () {
    }
};
export function serviceCall(): Promise {
    return appManage.serviceCall.apply(appManage, _.slice(arguments));
}

lib.init(config).then(function () {
    return common.init();
}).then(function () {
    return bootstrap(config);
}).then(function (result) {
    result.server.listen(config.listen.port, config.listen.ip);
    appManage = result.appManage;
});
