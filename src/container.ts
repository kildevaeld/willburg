
import {DIContainer} from 'stick.di';

class WillburgContainer extends DIContainer {
    
    
}

export const Container: DIContainer = new WillburgContainer();
Container.makeGlobal();

