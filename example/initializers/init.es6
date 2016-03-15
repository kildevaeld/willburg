
const m  = require('../../lib/middlewares/static').Static

module.exports = async function init (app) {

    app.mount('/public', m(['public','controllers']));
    
}