'use strict';
require('babel-register')({
    presets: ['es2015-without-regenerator', 'stage-0'],
    plugins: ['transform-decorators-legacy'],
    extensions: [".es6"]
});


var Willburg = require('../lib/willburg').Willburg;


let app = new Willburg();

app.startAndListen(3000).catch( e => {
    console.log(e.stack)
})

app.on('error', (e) => {
    
    console.error(e.stack)
    process.exit(-1)
})