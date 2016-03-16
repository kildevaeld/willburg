"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var Debug = require('debug');
var debug = Debug('willburg:bootstrap');
class Bootstrap {
    constructor(app) {
        this.app = app;
        this._tasks = [];
    }
    get length() {
        return this._tasks.length;
    }
    push(task) {
        for (var _len = arguments.length, tasks = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            tasks[_key - 1] = arguments[_key];
        }

        if (!Array.isArray(task)) task = [task];
        tasks = task.concat(tasks);
        for (var i = 0, ii = tasks.length; i < ii; i++) {
            debug('add tasks %s', tasks[i].name || tasks[i]);
            this._tasks.push(tasks[i]);
        }
        return this;
    }
    pushFront(task) {
        for (var _len2 = arguments.length, tasks = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            tasks[_key2 - 1] = arguments[_key2];
        }

        if (!Array.isArray(task)) task = [task];
        tasks = task.concat(tasks);
        for (var i = 0, ii = tasks.length; i < ii; i++) {
            debug('add tasks %s', tasks[i].name || tasks[i]);
        }
        this._tasks = tasks.concat(this._tasks);
        return this;
    }
    run() {
        return __awaiter(this, void 0, Promise, function* () {
            while (this.length > 0) {
                var task = this._tasks.shift();
                debug('run task %s', task.name || task);
                yield task.run(this.app);
            }
            Object.freeze(this);
        });
    }
}
exports.Bootstrap = Bootstrap;