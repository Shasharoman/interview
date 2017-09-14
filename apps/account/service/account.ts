import * as Promise from 'bluebird'
import * as proxy from '../proxy'
import * as _ from 'lodash'

const framework = require(process.env.framework);
const util = framework.common.util;

export {
    createAccount,
    verifyPasswordByUsername,
    accountById
};

function createAccount(account) {
    account = _.assign({
        username: '',
        password: '',
        nickname: ''
    }, account);

    account.password = util.md5(account.password);

    return proxy.createAccount(_.pick(account, ['username', 'nickname', 'password']));
}

function verifyPasswordByUsername(username, password) {
    return proxy.accountByUsername(username).then(function (result) {
        if (_.isEmpty(result)) {
            return Promise.resolve({
                pass: false
            });
        }

        let account = result[0];

        return Promise.resolve({
            id: account.id,
            pass: account.password === util.md5(password)
        });
    });
}

function accountById(id) {
    return proxy.accountById(id).then(function (result) {
        if (_.isEmpty(result)) {
            return Promise.reject('not found with id: ' + id);
        }

        return Promise.resolve(result[0]);
    });
}