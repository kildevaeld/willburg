
import * as decorators from '../../lib/decorators';


@decorators.controller()
export default class HomeController {
    

    @decorators.get('/')
    async index(ctx) {
        ctx.body = "Hello, World";
    }
}