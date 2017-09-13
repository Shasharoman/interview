import * as service from '../service';

export namespace Account {
    export function register(ctx, next) {
        return service.createAccount(ctx.request.body);
    }

    export function login(ctx, next) {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;

        return service.verifyPasswordByUsername(username, password).then(function (result) {
            if (result.pass) {
                ctx.session.accountId = result.id;
                return Promise.resolve();
            }

            return Promise.reject('username and password not match.');
        });
    }

    export function logout(ctx, next) {
        ctx.session = null;

        return Promise.resolve({
            redirect: '/'
        });
    }

    export function get(ctx, next) {
        let id = ctx.session.accountId;

        return service.accountById(id).then(function (account) {
            delete account.password;

            return Promise.resolve(account);
        });
    }
}