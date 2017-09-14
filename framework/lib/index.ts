import * as Promise from 'bluebird'
import {mysql} from './mysql'
import {mongo} from './mongo'

export * from './mongo'
export * from './mysql'

export function init(config): Promise {
    return mysql.init(config.mysql).then(function () {
        return mongo.init(config.mongo);
    });
}