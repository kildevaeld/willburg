import {Factories, decorators, Controller} from '../../'
import {Mysql} from '../services/mysql';

@decorators.inject('container', Mysql, Factories.View)
@decorators.controller()
export default class HomeController extends Controller {

    constructor(container, mysql, render) {
        super();
        this.render = render;
    }

    /*@decorators.query({
        title: decorators.Joi.string().required()
    }, null,true)*/
    @decorators.get('/')
    index(ctx) {
        ctx.type = "text/html";
        ctx.body = "Hello"; // await this.render('index');
    }

    @decorators.get('/throw')
    throw(ctx) {
        throw new Error('fuckit')
    }

    @decorators.post('/json')
    json (ctx) {

        return ctx.readBody().then(e => {
            console.log(e)
            ctx.body = e;
        })


    }
}