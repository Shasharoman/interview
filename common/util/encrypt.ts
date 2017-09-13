import * as crypto from 'crypto';

export {
    md5
};

function md5(str: string) {
    return crypto.createHash('md5').update(str).digest('hex');
}