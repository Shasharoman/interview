import * as _ from 'lodash'
import * as Router from 'koa-router'
import * as Promise from 'bluebird'

class App {
    private koa;
    private manifest;
    private router;

    constructor(koa, manifest) {
        this.koa = koa;
        this.manifest = manifest;

        this.router = new Router({prefix: this.manifest.base});
    }

    public init(): Promise {
        this.preSetup();
        this.setup();
        this.postSetup();

        return Promise.resolve();
    }

    private preSetup(): void {

    }

    public setup(): void {
        this.setMiddleware();
        this.setApiMiddleware();
        this.setApi();

        this.koa.use(this.router.routes());
    }

    public postSetup(): void {

    }

    private setMiddleware(): void {
        const self = this;

        _.each(this.manifest.middleware, function (item) {
            return self.router.use(item);
        });
    }

    private setApiMiddleware(): void {
        const self = this;

        _.each(this.manifest.api, function (item) {
            _.each(item.middleware, function (one) {
                _.each(_.isArray(item.method) ? item.method : [item.method], function (method) {
                    self.router[method](item.path, one);
                });
            });
        });
    }

    private setApi(): void {
        const self = this;

        _.each(this.manifest.api, function (item) {
            _.each(_.isArray(item.method) ? item.method : [item.method], function (method) {
                self.router[method](item.path, function (ctx, next) {
                    let result = item.impl.call(ctx, ctx, next);

                    if (_.isFunction(result.then)) {
                        return result.then(ctx.success).catch(ctx.fail);
                    }

                    return result;
                });
            });
        });
    }
}

export {App}