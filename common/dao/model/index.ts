import {Mysql} from '../mysql';
import {AccountModel} from './account';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export namespace Model {
    export const Account = AccountModel;
    export const tableFields = _.assign({}, AccountModel.tableFields);

    export function init(): Promise {
        let list = _.concat(AccountModel.initSql());

        return Promise.each(list, function (item) {
            return Mysql.execSql(item.sql, item.value);
        });
    }
}