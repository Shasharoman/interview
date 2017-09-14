import * as Promise from 'bluebird'
import {model} from './model'
import * as util from './util'

export * from './model'
export {util}

export function init(): Promise {
    return model.init();
}