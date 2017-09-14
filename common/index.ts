import * as _ from 'lodash';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import {Mysql, Mongo, Model} from './dao';

export namespace Common {
    export const mysql = Mysql;
    export const mongo = Mongo;
    export const model = Model;

    export const config = _loadConfig();

    export function init(): Promise {
        mysql.init(config.mysql);

        return mongo.init(config.mongo).then(function () {
            return model.init();
        });
    }

    function _loadConfig() {
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

        if (params.config === '-c') {
            params.config = '../conf/dev.json';
        }

        return JSON.parse(fs.readFileSync(params.config).toString());
    }
}