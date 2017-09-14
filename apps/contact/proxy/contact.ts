import * as Promise from 'bluebird'

const framework = require(process.env.framework);
const mongo = framework.mongo;

export {
    createContact,
    contactByAccountId,
    deleteContactById
};

function createContact(contact): Promise {
    contact.created_at = Date.now();
    contact.updated_at = Date.now();

    return mongo.insertOne('contact', contact);
}

function contactByAccountId(accountId, page, size): Promise {
    return mongo.find('contact', {accountId: accountId}, {
        skip: page * size,
        limit: size,
        sort: {
            update: -1
        },
        count: true
    });
}

function deleteContactById(id) {
    return mongo.deleteById('contact', id);
}