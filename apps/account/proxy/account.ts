import * as _ from 'lodash';

const framework = require(process.env.framework);
const common = framework.common;

const mysql = framework.mysql;
const accountFields = common.model.tableFields.account;

export {
    createAccount,
    accountByUsername,
    accountById
}

function createAccount(account) {
    account.id = null;
    account.created_at = Date.now();
    account.updated_at = Date.now();

    let sql = 'insert into account' +
        ' values(' + _.map(accountFields, item => ':' + item).join(', ') + ');';

    return mysql.execSql(sql, _.pick(account, accountFields));
}

function accountByUsername(username) {
    let sql = 'select ' + accountFields.join(', ') + ' from account where username = :username;';

    return mysql.execSql(sql, {username: username});
}

function accountById(id) {
    let sql = 'select ' + accountFields.join(', ') + ' from account where id = :id;';

    return mysql.execSql(sql, {id: id});
}