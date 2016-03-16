"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
__export(require('./controllers'));
__export(require('./initializers'));
__export(require('./routes'));
__export(require('./services'));
__export(require('./views'));
__export(require('./middlewares'));