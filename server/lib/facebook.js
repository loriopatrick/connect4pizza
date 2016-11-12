var FB = require('fb');

function load_details(client, access_token) {
  client.state = 'verifying_auth';

  FB.api('me', {
    fields: ['id', 'name', 'email', 'picture'],
    access_token: access_token
  }, function(res) {
    if (!res.id) {
      client.status = 'no_auth';
      return client.error('failed to authenticate');
    }

    client.fb_user = {
      id: res.id,
      name: res.name,
      profile_image: res.data.url
    };

    client.status = 'auth';
    client.json({ type: 'auth', success: true });
  });
}

module.exports = load_details;
