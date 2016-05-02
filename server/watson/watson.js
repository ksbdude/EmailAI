
// module imports
import { Meteor } from 'meteor/meteor';
import watson from 'watson-developer-cloud';
import SparkPost from 'sparkpost';
import Firebase from 'firebase';
import hod from 'havenondemand';
import Fiber from 'fibers';



if (Meteor.isServer) {


    // var sparky = new SparkPost(Meteor.settings.development.sparkpost.auth_key);
    var sparky = new SparkPost(process.env.SPARKPOST_AUTHKEY);

    if (sparky === undefined) {
        //config for CI
        var sparky = new SparkPost(Meteor.settings.development.sparkpost.auth_key);
    }

    var watsonInput;
    var emailText;
    var watsonOutput;
    var email;
    var jsonOutput;


    var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");

    // when a new child is added to remote db function is triggered
    ref.orderByKey().limitToLast(1).on("child_added", function(snapshot) {

        var child = snapshot.val();
        console.log(snapshot.key());
        var snapKey = '' + snapshot.key();

        snapshot.child("0/msys/relay_message/content/").forEach(function(snap) {
            if (snap.key() === 'text') {
                watsonInput = snap.val();
                watsonInput = watsonInput.replace('>', '').replace('<', '');
            }
        });

        snapshot.child("0/msys/relay_message/").forEach(function(snap) {
            if (snap.key() === 'msg_from') {
                email = snap.val();
                console.log('email: ' + snap.val());
            }
        });
        // server side hod function
        var runHod = function() {
            // calls method for hod, callback data is stored
            Meteor.call("havenTest", watsonInput, function(callback) {
                console.log(callback);
                var hodOutput = callback;
            });
        };

      });

        // calls server side HavenOnDemand method
        var runHod = function() {
            // calls method for hod, callback data is stored
            Meteor.call("havenTest", watsonInput, function(callback) {
                console.log(callback);
                var hodOutput = callback;
            });
        };

        // calls server side Watson method
        var watsonInput = function() {
            Meteor.call("watsonTone", watsonInput, function(callback, err) {
                if (err) {
                    console.log('failed to call server side method', err);
                } else {
                    console.log(callback);
                }
            });
        };

        var count; // why is this here

        var buildEmail = function(jsonOutput){
          // Emotions
          var anger = jsonOutput[0].tones[0].score;
          anger *= 100;
          anger = Math.round(anger);

          var disgust = jsonOutput[0].tones[1].score;
          disgust *= 100;
          disgust = Math.round(disgust);

          var fear = jsonOutput[0].tones[2].score;
          fear *= 100;
          fear = Math.round(fear);

          var joy = jsonOutput[0].tones[3].score;
          joy *= 100;
          joy = Math.round(joy);

          var sadness = jsonOutput[0].tones[4].score;
          sadness *= 100;
          sadness = Math.round(sadness);

          // Writing Tone
          var analytical = jsonOutput[1].tones[0].score;
          analytical *= 100;
          analytical = Math.round(analytical);

          var confident = jsonOutput[1].tones[1].score;
          confident *= 100;
          confident = Math.round(confident);

          var tentative = jsonOutput[1].tones[2].score;
          tentative *= 100;
          tentative = Math.round(tentative);


          // Social Tone
          var openness = jsonOutput[2].tones[0].score;
          openness *= 100;
          openness = Math.round(openness);

          var conscientiousness = jsonOutput[2].tones[1].score;
          conscientiousness *= 100;
          conscientiousness = Math.round(conscientiousness);

          var extraversion = jsonOutput[2].tones[2].score;
          extraversion *= 100;
          extraversion = Math.round(extraversion);

          var agreeableness = jsonOutput[2].tones[3].score;
          agreeableness *= 100;
          agreeableness = Math.round(agreeableness);

          var emotionalrange = jsonOutput[2].tones[4].score;
          emotionalrange *= 100;
          emotionalrange = Math.round(emotionalrange);

          // TODO: figure out sparkpost templates to make this cleaner/easier/better looking
          emailText = '<html><body><h2>EmailAI TEST</h2><h3>Original Email: </h3><p>' + watsonInput + '</p><h3>Results: </h3>' +
              '<table><tr><td>Anger</td><td>' + anger +
              '%</td></tr><tr><td>Disgust</td><td>' + disgust +
              '%</td></tr><tr><td>Fear</td><td>' + fear +
              '%</td></tr><tr><td>Joy</td><td>' + joy +
              '%</td></tr><tr><td>Sadness</td><td>' + sadness +
              '%</td></tr><tr><td>Analytical</td><td>' + analytical +
              '%</td></tr><tr><td>Confident</td><td>' + confident +
              '%</td></tr><tr><td>Tentative</td><td>' + tentative +
              '%</td></tr><tr><td>Openness</td> <td>' + openness +
              '%</td></tr><tr><td>Conscientiousness</td><td>' + conscientiousness +
              '%</td></tr><tr><td>Extraversion</td><td>' + extraversion +
              '%</td></tr><tr><td>Agreeableness</td><td>' + agreeableness +
              '%</td></tr><tr><td>Emotional Range</td><td>' + emotionalrange +
              '%</td></table>' + '<div></div> <p> hodOutput:' + hodOutput + '</p>' + '<p><i>Created by Kevin Burns and Brett Henderson</i></p></body></html>';

          console.log('EMAIL TEXT: ' + emailText);

        return emailText;

      };

        //function to send email, calling method on server
        var sendMail = function(emailText) {
            Meteor.call('sparkpostSend', emailText, email);
        };

        //call to remove child from firebaseDb
        // function removeChild(snapKey) {
        //     ref.child(snapKey).remove();
        // }

}
