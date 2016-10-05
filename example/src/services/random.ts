
import {decorators, Configurable} from '../../..'

export class RandomOptions {
    amount: number;
}


@decorators.options(RandomOptions)
@decorators.service()
export class Random implements Configurable<RandomOptions> {
    constructor(private options: RandomOptions) {}
    random(): number {
        return Math.random() * this.options.amount||1.0;
    }

}