# Willburg
Nodejs web framework based on Koa2



## Usage

```javascript

// controllers/home.ts

import {decorators, Context, Joi} from 'willburg';
import {Database} from '../services/database';

@decorators.controller()
export class Home {

  constructor(private db: Database) {}

  @decorators.get('/')
  index (ctx: Context) {
    ctx.body = "Hello, World";
  }
  
  @decorators.params({ 
    user_id: Joi.number()
  })
  @decorators.get('/:user_id') 
  async show (ctx: Context) {
    // typeof ctx.params.user_id === 'number'; 
    ctx.type = 'json';
    let user = await this.db.query({id:ctx.params.user_id})
    ctx.body = user;
  }
    
}

// services/database.ts

@decorators.service()
export class Database {
  query () {}
}

// app.ts

const app = new Willburg({
  directories: ['controllers', 'services']
});

app.startAndListen(3000).then(() => {
  console.log('Application started and listening on port 3000');
});

```
