import * as Promise from 'bluebird';
import {Mysql} from '../mysql';

export namespace AccountProxy {
    export function accountById(id: number): Promise {
        let sql = 'select * from account where id = :id;';

        return Mysql.execSql(sql, {id: id});
    }
}