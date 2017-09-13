import * as mysql from 'mysql';
import * as _ from 'lodash';
import * as Promise from 'bluebird';

export namespace Mysql {
    let pool;

    export function init(options: object) {
        if (pool) {
            return;
        }

        pool = mysql.createPool(_.assign({
            connectionLimit: 16,
            host: 'localhost',
            user: 'root',
            password: '',
        }, options));
    }

    export function execSql(sql: string, params: object): Promise {
        let conn;

        return connection().then(function (connection) {
            conn = connection;

            return Promise.promisify(connection.query, {context: connection})(sql, params);
        }).then(function (result) {
            conn && conn.release();
            return Promise.resolve(result);
        }).catch(function (err) {
            conn && conn.release();

            // todo write to log file
            console.error(err);

            return Promise.reject(err.toString());
        });
    }

    function connection(): Promise {
        return Promise.promisify(pool.getConnection, {context: pool})().then(function (connection) {
            connection.config.queryFormat = function (query, values) {
                if (!values) {
                    return query;
                }

                return query.replace(/\:(\w+)/g, function (txt, key) {
                    if (values.hasOwnProperty(key)) {
                        return this.escape(values[key]);
                    }
                    return txt;
                }.bind(this));
            };

            return Promise.resolve(connection);
        });
    }
}