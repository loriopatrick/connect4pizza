const pizza = require('./lib/pizza');

pizza.buy_pizza('Patrick Lorio', 'patrick@lorio.me', 'cheese', {
  city: 'Berkeley',
  state: 'CA',
  street: '1732 Highland Place',
  zip_code: '94709'
}, {}, (err)=>console.log(err));
