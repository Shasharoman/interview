import * as _ from 'lodash'

export namespace account {
    const schema = {
        account: [
            ['id', 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY'],
            ['username', 'VARCHAR(32) UNIQUE NOT NULL'],
            ['password', 'VARCHAR(32) NOT NULL'],
            ['nickname', 'VARCHAR(64) DEFAULT NULL'],
            ['created_at', 'BIGINT UNSIGNED NOT NULL'],
            ['updated_at', 'BIGINT UNSIGNED NOT NULL'],
        ]
    };

    export function initSql(): Array<object> {
        let prefix = 'CREATE TABLE IF NOT EXISTS ';
        let suffix = ' ENGINE=InnoDB CHARACTER SET=utf8 COLLATE=utf8_general_ci';

        return _.map(schema, function (fields, table) {
            return {
                sql: [prefix, table, '(', _.map(fields, items => items.join(' ')).join(','), ')', suffix].join(''),
                value: {}
            };
        });
    }

    export function migrationSql(preVersion: number, currentVersion: number): Array<object> {
        return [];
    }

    export const tableFields = _.mapValues(schema, fields => _.map(fields, items => items[0]))
}