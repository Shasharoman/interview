import {AppManage} from './appManage';
import {Common} from '../common';

Common.init().then(function () {
    return AppManage.setupMiddleware();
}).then(function () {
    return AppManage.setupApp();
}).then(function () {

});