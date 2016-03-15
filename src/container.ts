
import {DIContainer} from 'stick.di';

let container = new DIContainer();
container.registerInstance('container', container);
container.makeGlobal();

export const Container = container;
