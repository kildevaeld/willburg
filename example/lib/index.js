"use strict";
const _1 = require('../../');
const random_1 = require('./services/random');
let app = new _1.Willburg({
    directories: ['lib/controllers', 'lib/services']
});
app.configure(random_1.Random).amount = 200;
app.startAndListen(8080).catch(e => {
    console.log(e);
});
