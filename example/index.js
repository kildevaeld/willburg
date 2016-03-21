'use strict';
require('babel-register')({
    plugins: require('../gulp/config').babel.concat(['transform-decorators-legacy']),
    //presets: ['es2015-without-regenerator', 'stage-0'],
    //plugins: ['transform-decorators-legacy'],
    extensions: [".es6"]
});


var Willburg = require('../lib/willburg').Willburg;


let app = new Willburg({
    directories: ['controllers', 'services']
});
app.keys = ['hello']
app.startAndListen(3000).catch( e => {
    console.log(e.stack)
})

app.on('error', (e) => {
    
    console.error(e)
    process.exit(-1)
})