// Meteor.startup(function() {
//
//   Meteor.Mailgun.config({
//     username: 'postmaster@domain.com',
//     password: 'password-goes-here'
//   });
//
//   Meteor.methods({
//     'sendContactEmail': function(name, email, message) {
//       this.unblock();
//
//       Meteor.Mailgun.send({
//         to: 'recipient@example.com',
//         from: name + ' <' + email + '>',
//         subject: 'New Contact Form Message',
//         text: message,
//         html: Handlebars.templates['contactEmail']({siteURL: Meteor.absoluteUrl(), fromName: name, fromEmail: email, message: message})
//       });
//     }
//   });
// });


//handles email
// Meteor.startup(function() {
//   smtp = {
//     username:'postmaster@idbolt.io',
//     password:'email22',
//     server: 'smtp.sparkpostmail.com',
//     post: 587
//   }
//   process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
// });

// var request = Meteor.require('request');
//
// request({
//   method: 'GET',
//   url: 'https://api.sparkpost.com/api/v1/inbound-domains',
//   headers: {
//     'Authorization': 'd1be904ec5ce27af2a15b99b85af2e574bc51082',
//     'Accept': 'application/json'
//   }}, function (error, response, body) {
//   console.log('Status:', response.statusCode);
//   console.log('Headers:', JSON.stringify(response.headers));
//   console.log('Response:', body);
// });
// });
//
// var request = Meteor.require('request');
//
// request('https://api.sparkpost.com/api/v1/relay-webhooks/12013026328707075', function (error, response, body) {
//   console.log('Status:', response.statusCode);
//   console.log('Headers:', JSON.stringify(response.headers));
//   console.log('Response:', body);
// });
// });
// request.send();

//sparkpost
var SparkPost = Meteor.npmRequire('sparkpost');
var sparky = new SparkPost('eb5e8fde469ca2f150b28539eeccee8100b99e1f');

sparky.transmissions.send({
  transmissionBody: {
    content: {
      from: 'postmaster@idbolt.io',
      subject: 'Oh hey!',
      //TODO: Watson Output data goes here
      // watsonData.val();
      //html: watsonData.val()
      //html:'<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'
    },
    recipients: [
      {address: 'bretth18@gmail.com'}
    ]
  }
}, function(err, res) {
  if (err) {
    console.log('Whoops! Something went wrong');
    console.log(err);
  } else {
    console.log('Woohoo! You just sent your first mailing!');
  }
});
