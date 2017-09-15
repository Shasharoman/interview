import * as _ from 'lodash'
import * as fs from 'fs'

export const config = (function () {
    let params = {
        config: '-c'
    };
    let argNames = _.values(params);

    _.each(process.argv, function (item, index) {
        if (!_.includes(argNames, item)) {
            return;
        }
        let key = _.findKey(params, value => {
            return value === item;
        });
        params[key] = process.argv[index + 1];
    });

    return JSON.parse(fs.readFileSync(params.config).toString());
})();