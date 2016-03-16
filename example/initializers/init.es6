
import {Static, ErrorHandler} from '../../lib/middlewares'

module.exports = async function init (app) {
    app.use(ErrorHandler());
    app.mount('/public', Static(['public','controllers']));
    
}