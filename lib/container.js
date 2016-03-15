"use strict";

var stick_di_1 = require('stick.di');
var container = new stick_di_1.DIContainer();
container.registerInstance('container', container);
container.makeGlobal();
exports.Container = container;