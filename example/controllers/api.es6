import {Factories, decorators} from '../../'

function Middleware (ctx, next) {
    console.log('MIDDLEWARE');
    return next();
}


@decorators.namespace('/api', Middleware)
@decorators.controller()
export default class ApiController {
    
    @decorators.get('/')
    index(ctx) {
        ctx.type = "text/html";
        ctx.body = "Hello, World";
    }
}