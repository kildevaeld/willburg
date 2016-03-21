import * as d from './decorators';
import * as m from './middlewares/index';
export {Factories, Variables} from './metadata'
export * from './interfaces';
export * from './willburg';
export const decorators = d;
export const middleware = m;
export * from './controller';

import * as J from 'joi';

export const Joi = J;