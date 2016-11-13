const async = require('async');
const dominos = require('dominos');

const CHEESE_PIZZA = {
  code: '12SCREEN',
  quantity: 1,
  options: {
    C: { '1/1': 1 },
    X: { '1/1': 1 },
  }
};

const PEPERONI_PIZZA = {
  code: '12SCREEN',
  quantity: 1,
  options: {
    C: { '1/1': 1 },
    P: { '1/1': 1 },
    X: { '1/1': 1 },
  }
};

const MAX_PRICE = 20;

function buy_pizza(name, email, pizza, destination, payment, cb) {

  var pizza_address = {
    City: destination.city,
    PostalCode: destination.zip_code,
    Region: destination.state,
    Street: destination.street
  };

  var address = destination.street + ' ' + destination.state + ' ' + destination.state + ' ' + destination.zip_code;

  async.waterfall([
      function find_store(cb) {
        dominos.Util.findNearbyStores(
          address, 'Delivery',
          cb.bind(null, null)
        );
      },
      function pick_store(stores_res, cb) {
        if (!stores_res.success) {
          return cb(new Error('failed to find stores'));
        }

        var stores = stores_res.result.Stores;
        for (var i = 0; i < stores.length; ++i) {
          var s = stores[i];
          if (s.ServiceIsOpen.Delivery) {
            return cb(null, s.StoreID);
          }
        }

        cb(new Error('no stores open near you at this time'));
      },
      function build_order(store_id, cb) {
        var name_parts = name.split(' ');
        var customer = new dominos.Customer({
          firstName: name_parts[0],
          lastName: name_parts[1],
          address: pizza_address,
        });

        var order = new dominos.Order({
          customer: customer,
          storeID: store_id,
          deliveryMethod: 'Delivery'
        });

        if (pizza === 'peperoni') {
          order.addItem(new dominos.Item(PEPERONI_PIZZA));
        }
        else {
          order.addItem(new dominos.Item(CHEESE_PIZZA));
        }

        order.price(function(res) {
          if (!res.success || res.result.Status !== 1) {
            return cb(new Error('failed to build order'));
          }

          var price = res.result.Order.Amounts;
          price = price.Payment || price.Customer || price.Menu;

          if (+price > MAX_PRICE) {
            return cb(new Error('order too expensive'));
          }

          cb(null, order);
        });
      },
      function place_order(order, cb) {
        var card = new order.PaymentObject();
        card.Amount = order.Amounts.Customer;
        card.Number = payment.card_number;
        card.CardType = order.validateCC(payment.card_number);
        card.Expiration = payment.expiration;
        card.SecurityCode = payment.security;
        card.PostalCode = payment.zip_code;

        order.Payments.push(card);
        order.place(function(results) {
          console.log(results.result.StatusItems);
        });
      }
  ], function(err) {
    console.log(err);
  });
}

function setup_customer(client, data) {
  async.waterfall([
      function find_store(cb) {
        dominos.Util.findNearbyStores(
          data.address, 'Delivery',
          cb.bind(null, null)
        );
      },
      function load_menu(stores_res, cb) {
        if (!stores_res.success) {
          return cb(new Error('failed to find stores'));
        }

        var stores = stores_res.result.Stores;
        console.log(stores);
      }
  ], function(err) {
    client.error(err.message);
  });
}

module.exports = {
  setup_customer: setup_customer,
  buy_pizza: buy_pizza
};
