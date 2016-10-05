"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Debug = require('debug');
const debug = Debug('willburg:bootstrap');
class Bootstrap {
    constructor(app) {
        this.app = app;
        this._tasks = [];
    }
    get length() {
        return this._tasks.length;
    }
    push(task, ...tasks) {
        if (!Array.isArray(task))
            task = [task];
        tasks = task.concat(tasks);
        for (let i = 0, ii = tasks.length; i < ii; i++) {
            debug('add tasks %s', tasks[i].name || tasks[i]);
            this._tasks.push(tasks[i]);
        }
        return this;
    }
    pushFront(task, ...tasks) {
        if (!Array.isArray(task))
            task = [task];
        tasks = task.concat(tasks);
        for (let i = 0, ii = tasks.length; i < ii; i++) {
            debug('add tasks %s', tasks[i].name || tasks[i]);
        }
        this._tasks = tasks.concat(this._tasks);
        return this;
    }
    run() {
        return __awaiter(this, void 0, Promise, function* () {
            while (this.length > 0) {
                let task = this._tasks.shift();
                debug('run task %s', task.name || task);
                yield task.run(this.app);
            }
            Object.freeze(this);
        });
    }
    runAsync() {
        return __awaiter(this, void 0, Promise, function* () {
            let promises = this._tasks.map(t => t.run(this.app));
            yield promises;
            Object.freeze(this);
        });
    }
}
exports.Bootstrap = Bootstrap;
