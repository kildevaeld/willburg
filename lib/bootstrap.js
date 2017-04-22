"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug('willburg:bootstrap');
class Bootstrap {
    constructor(app) {
        this.app = app;
        this._tasks = [];
        this._frozen = false;
        this._running = false;
    }
    get length() {
        return this._tasks.length;
    }
    push(task, ...tasks) {
        if (this._frozen)
            throw new Error('bootstrap already runned');
        //if (this._running) throw new Error('cannot mutate bootstrapper when running');
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
        if (this._frozen)
            throw new Error('bootstrap already runned');
        //if (this._running) throw new Error('cannot mutate bootstrapper when running');
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
        return __awaiter(this, void 0, void 0, function* () {
            if (this._frozen)
                throw new Error('bootstrap already runned');
            if (this._running)
                throw new Error('bootstrap is already running');
            this._running = true;
            while (this.length > 0) {
                let task = this._tasks.shift();
                debug('run task %s', task.name || task);
                yield task.run(this.app);
            }
            this._running = false;
            this._frozen = true;
            Object.freeze(this);
        });
    }
    runParallel() {
        if (this._frozen)
            throw new Error('bootstrap already runned');
        if (this._running)
            throw new Error('bootstrap is already running');
        this._running = true;
        let promises = this._tasks.map(t => t.run(this.app));
        return Promise.all(promises)
            .then(() => {
            this._running = false;
            this._frozen = true;
            Object.freeze(this);
        });
    }
}
exports.Bootstrap = Bootstrap;
