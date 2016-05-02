import { Meteor } from 'meteor/meteor';
import hod from 'havenondemand';
import SparkPost from 'sparkpost';
import watson from 'watson-developer-cloud';


if(Meteor.isServer){
  Meteor.methods({
    havenTest:function(watsonInput){

      // define hod
      var apikey = process.env.HOD_AUTHKEY;
      client = new hod.HODClient(apikey);

      // define some test data
      var testData = {
        'text': watsonInput
      };

      // define callback
      var callback = function(err,resp,body){
        // our callback body will be appended to email output
        console.log(body);
        return body;
      };

      // call data
      client.call('analyzesentiment', callback, testData);
    },

    // method takes two params from watson
    sparkpostSend:function(emailText,email){
      var sparky = new SparkPost(process.env.SPARKPOST_AUTHKEY);

      // send transmission
      sparky.transmissions.send({
        transmissionBody: {
            content: {
              from: 'postmaster@idbolt.io',
              subject: 'Results!',
              html: '' + emailText,
              text: ''
            },
            recipients: [{
              address: email
            }]
        }
      }, function(err, res) {
          if(err) {
            console.log('failed to send message');
            console.log(err);
          } else {
            console.log('message results from watson sent');
          }
      });
    },
    watsonTone:function(watsonInput){
      // setup watson
      var tone_analyzer = watson.tone_analyzer({
        username: Meteor.settings.development.watson.username,
        password: Meteor.settings.development.watson.password,
        version: 'v3-beta',
        version_date: '2016-02-11'
      });

      // call tone analyzer
      tone_analyzer.tone({
        text: '' + watsonInput
      }, function(err, tone) {
        console.log('running watson');
        if (err){
          console.log('ERROR RUNNING WATSON:', err);
        } else {
          // stringify json data to just show tones
          var watsonOutput = JSON.stringify(tone, null, 2);
          var jsonOutput = JSON.parse(watsonOutput);
          jsonOutput = jsonOutput.document_tone.tone_categories;
          return jsonOutput;

        }
      });

    },

    // server side method to handle image to text processing
    havenImage: function(){

    }


  });
}
