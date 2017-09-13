import * as Promise from 'bluebird';
import * as proxy from '../proxy';
import * as _ from 'lodash';

export {
    createContactWithAccountId,
    contactByAccountId,
    deleteContactById
};

function createContactWithAccountId(accountId, contact): Promise {
    if (!_.isObject(contact)) {
        return Promise.reject('contact must be object.');
    }

    // keep contact simple
    contact = _.pickBy(contact, function (item) {
        return !_.isObject(item);
    });

    return proxy.createContact(_.assign(contact, {accountId: accountId}));
}

function contactByAccountId(accountId, page, size): Promise {
    return proxy.contactByAccountId(accountId, page, size);
}

function deleteContactById(id) {
    return proxy.deleteContactById(id);
}