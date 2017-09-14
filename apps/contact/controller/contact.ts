import * as service from '../service'

export namespace Contact {
    export function create(ctx, next) {
        return service.createContactWithAccountId(ctx.session.accountId, ctx.request.body);
    }

    export function list(ctx, next) {
        let page = Number(ctx.query.page) || 0;
        let size = Number(ctx.query.size) || 20;

        let accountId = ctx.session.accountId;
        return service.contactByAccountId(accountId, page, size);
    }

    export function deleteById(ctx, next) {
        let id = ctx.params.id;

        return service.deleteContactById(id);
    }
}