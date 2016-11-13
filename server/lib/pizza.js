const async = require('async');
const dominos = require('dominos');

function buy_pizza(name, email, destination, payment, cb) {
  async.waterfall([
      function find_store(cb) {
        dominos.Util.findNearbyStores(
          destination, 'Delivery',
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
            return cb(null, s);
          }
        }

        cb(new Error('no stores open near you at this time'));
      },
      function load_menu(store_details, cb) {
        var store = new dominos.Store({ ID: store_details.StoreID });

        store.getMenu(cb.bind(null, null));
      },
      function pick_item(menu, cb) {
        console.log(menu.rootCategories.Food);
      }
  ], cb);
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
