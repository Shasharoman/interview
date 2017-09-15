import * as Promise from 'bluebird'
import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'
import {AppManage} from '../core'

export function bootstrap(config): Promise {
    const appManage = new AppManage();

    return appManage.setupMiddleware(config.middleware).then(function () {
        return appManage.setupApp(_.map(config.apps, function (item) {
            return {
                name: item,
                path: path.join(config.appDistDir, item),
                manifest: JSON.parse(fs.readFileSync(path.join(config.appBaseDir, item, 'manifest.json')).toString())
            };
        }));
    }).then(function (server) {
        return Promise.resolve({
            server: server,
            appManage: appManage
        });
    });
}