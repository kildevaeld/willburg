
import {Static, ErrorHandler} from '../../lib/middlewares'

module.exports = function init (app) {
    app.use(ErrorHandler());
    app.mount('/public', Static(['public','controllers']));
    
}