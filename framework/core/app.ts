import * as path from 'path';
import * as _ from 'lodash';
import * as Router from 'koa-router';
import * as Promise from 'bluebird';
import * as fs from 'fs';

class App {
    public config;
    public koa;
    public manifest;

    private router;
    private appMiddleware = {};
    private globalMiddleware = {};

    // todo remove config dependencies
    constructor(koa, manifest, config) {
        this.koa = koa;
        this.manifest = manifest;
        this.config = config;
        this.router = new Router({prefix: this.manifest.base});

        let filePath = path.join(this.config.appDistDir, this.manifest.name, 'middleware');
        if (fs.existsSync(filePath)) {
            this.appMiddleware = require(filePath);
        }
        this.globalMiddleware = require(path.join(this.config.distDir, 'middleware'));
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
            self.router.use(function (ctx, next) {
                if (self.appMiddleware[item]) {
                    return self.appMiddleware[item].call(ctx, ctx, next);
                }

                return self.globalMiddleware[item].call(ctx, ctx, next);
            });
        });
    }

    private setApiMiddleware(): void {
        const self = this;

        _.each(this.manifest.api, function (item) {
            _.each(item.middleware, function (middlewareName) {
                let impl = self.globalMiddleware[middlewareName];
                if (self.appMiddleware[middlewareName]) {
                    impl = self.appMiddleware[middlewareName];
                }

                _.each(_.isArray(item.method) ? item.method : [item.method], function (method) {
                    self.router[method](item.path, impl(self.config));
                });

                // self.router.use(item.path, impl(config));
            });
        });
    }

    private setApi(): void {
        const self = this;
        const controller = require(path.join(this.config.appDistDir, this.manifest.name, 'controller'));

        _.each(this.manifest.api, function (item) {
            _.each(_.isArray(item.method) ? item.method : [item.method], function (method) {
                self.router[method](item.path, function (ctx, next) {
                    return _.get(controller, item.impl).call(ctx, ctx, next).then(ctx.success).catch(ctx.fail);
                });
            });
        });
    }
}

export {App};