"use strict";
const stick_di_1 = require('stick.di');
let container = new stick_di_1.DIContainer();
container.registerInstance('container', container);
container.makeGlobal();
exports.Container = container;
