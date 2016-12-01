
import { Controller, decorators, Context } from '../../../';
import { Random } from '../services/random';
import { inject } from 'stick.di'

@decorators.controller()
export class HomeController extends Controller {

    constructor(private rnd: Random) {
        super()
    }

    @decorators.get('/random')
    random(ctx: Context) {
        ctx.body = "Random " + this.rnd.random()
    }

    @decorators.get("/send")
    send(ctx: Context) {
        return ctx.send("home.js", {
            root: __dirname
        })
    }

}