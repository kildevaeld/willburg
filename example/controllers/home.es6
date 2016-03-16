import {Factories, decorators} from '../../'
import {Mysql} from '../services/mysql';

@decorators.inject('container', Mysql, Factories.View)
@decorators.controller()
export default class HomeController {
    
    constructor(container, mysql, render) {
        this.render = render;
    }    

    @decorators.query({
        title: decorators.Joi.string().required()
    })
    @decorators.get('/')
    async index(ctx) {
        ctx.type = "text/html";
        ctx.body = await this.render('index');
    }
    
    @decorators.get('/throw')
    async throw(ctx) {
        throw new Error('fuckit')
    }
}