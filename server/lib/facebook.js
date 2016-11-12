var FB = require('fb');

function load_details(client, access_token) {
  client.state = 'verifying_auth';

  FB.api('me', {
    fields: ['id', 'name', 'email', 'picture'],
    access_token: access_token
  }, function(res) {
    if (!res.id) {
      client.state = 'no_auth';
      return client.error('failed to authenticate');
    }

    client.fb_user = {
      id: res.id,
      name: res.name,
      profile_image: 'https://graph.facebook.com/' + res.id + '/picture?type=large'
    };

    client.state = 'auth';
    client.json({ type: 'auth', success: true });
  });
}

module.exports = load_details;
