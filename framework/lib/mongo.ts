import * as Promise from 'bluebird'
import * as _ from 'lodash'
import {MongoClient, ObjectID} from 'mongodb'

export namespace mongo {
    let connection;

    export function init(options): Promise {
        options = _.assign({
            host: 'localhost',
            port: '27017',
        }, options);

        let url = 'mongodb://';
        if (options.user) {
            url += [options.user, options.password].join(':') + '@'
        }
        url += [options.host, options.port].join(':') + '/' + options.database;

        return MongoClient.connect(url).then(function (conn) {
            connection = conn;

            return Promise.resolve();
        });
    }

    export function insertOne(table, model): Promise {
        let collection = connection.collection(table);

        return collection.insertOne(model);
    }

    export function find(table, condition, options): Promise {
        let collection = connection.collection(table);

        let fn = collection.find(condition);
        if (options.skip) {
            fn.skip(options.skip);
        }
        if (options.limit) {
            fn.limit(options.limit);
        }
        if (options.sort) {
            fn.sort(options.sort);
        }

        if (!options.count) {
            return fn.toArray();
        }

        let result = {
            count: 0,
            items: []
        };
        return collection.count(condition).then(function (count) {
            result.count = count;

            return fn.toArray();
        }).then(function (items) {
            result.items = items;
            return Promise.resolve(result);
        });
    }

    export function deleteOne(table, condition): Promise {
        let collection = connection.collection(table);

        return collection.deleteOne(condition);
    }

    export function deleteById(table, id): Promise {
        let collection = connection.collection(table);

        return collection.deleteOne({_id: new ObjectID(id)});
    }
}