import * as Promise from 'bluebird'
import * as _ from 'lodash'
import {account} from './account'

const framework = require(process.env.framework);

export namespace model {
    export const tableFields = _.assign({}, account.tableFields)

    export function init(): Promise {
        let list = _.concat(account.initSql());

        return Promise.each(list, function (item) {
            return framework.mysql.execSql(item.sql, item.value);
        });
    }
}