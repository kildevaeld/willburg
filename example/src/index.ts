

import {Willburg, WillburgOptions} from '../../'
import {RandomOptions, Random} from './services/random';

let app = new Willburg({
    directories: ['lib/controllers', 'lib/services']
});

app.configure<RandomOptions>(Random).amount = 200;

app.startAndListen(8080).catch( e => {
    console.log(e)
})