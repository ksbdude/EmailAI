  //firebase data input

  var watson = Meteor.npmRequire('watson-developer-cloud');

  var SparkPost = Meteor.npmRequire('sparkpost');
  var sparky = new SparkPost('a6f9c6da23d308a74890919b5d2a644ad475f033');

  var watsonInput;
  var emailText;
  var watsonOutput;
  var email;
  var jsonOutput;

  var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");

  ref.orderByKey().limitToLast(1).on("child_added", function(snapshot) {
    var child = snapshot.val();
    console.log(snapshot.key());
    var snapKey = '' + snapshot.key();

    snapshot.child("0/msys/relay_message/content/").forEach(function(snap){
      if(snap.key() === 'text'){
        watsonInput = snap.val();
        watsonInput = watsonInput.replace('>', '').replace('<', '').replace('LEGAL NOTICE: The information in this transmission is or may be privileged, confidential (and/or copyrighted), and intended only for the use of the individual(s) or entity(s) named above. If you are not the intended recipient, please note that any disclosure, copying, distribution, or other action in reliance on the contents of this transmission is strictly prohibited and may be unlawful. If you received this transmission in error, please notify the sender and destroy the original message and all copies from your system. It is the responsibility of the recipient to ensure that this transmission is virus free and no responsibility is accepted by JBREC, LLC. for any loss or damage arising in any way from its use. Thank you.', '');
      }
    });

    snapshot.child("0/msys/relay_message/").forEach(function(snap){
      if(snap.key() === 'msg_from'){
        email = snap.val();
        console.log('email: ' + snap.val());
      }
    });


    var count;

    var tone_analyzer = watson.tone_analyzer({
      username: '5d2c5f1e-fbe2-4aa6-8186-2c9a6dd9f9aa',
      password: 'xPYobQo1AZdx',
      version: 'v3-beta',
      version_date: '2016-02-11'
    });

    tone_analyzer.tone({ text : "" + watsonInput},
      function(err, tone) {
       console.log("RUNNING WATSON");
       if (err)
        console.log(err);
      else {
        watsonOutput = JSON.stringify(tone, null, 2);
        jsonOutput = JSON.parse(watsonOutput);
        jsonOutput = jsonOutput['document_tone']['tone_categories'];

      //Emotions
      var anger = jsonOutput[0]["tones"][0]["score"];
      anger *= 100;
      anger = Math.round(anger);

      var disgust = jsonOutput[0]["tones"][1]["score"];
      disgust *= 100;
      disgust = Math.round(disgust);

      var fear = jsonOutput[0]["tones"][2]["score"];
      fear *= 100;
      fear = Math.round(fear);

      var joy = jsonOutput[0]["tones"][3]["score"];
      joy *= 100;
      joy = Math.round(joy);

      var sadness = jsonOutput[0]["tones"][4]["score"];
      sadness *= 100;
      sadness = Math.round(sadness);

      //Writing Tone
      var analytical = jsonOutput[1]["tones"][0]["score"];
      analytical *= 100;
      analytical = Math.round(analytical);

      var confident = jsonOutput[1]["tones"][1]["score"];
      confident *= 100;
      confident = Math.round(confident);

      var tentative = jsonOutput[1]["tones"][2]["score"];
      tentative *= 100;
      tentative = Math.round(tentative);


      //Social Tone
      var openness = jsonOutput[2]["tones"][0]["score"];
      openness *= 100;
      openness = Math.round(openness);

      var conscientiousness = jsonOutput[2]["tones"][1]["score"];
      conscientiousness *= 100;
      conscientiousness = Math.round(conscientiousness);

      var extraversion = jsonOutput[2]["tones"][2]["score"];
      extraversion *= 100;
      extraversion = Math.round(extraversion);

      var agreeableness = jsonOutput[2]["tones"][3]["score"];
      agreeableness *= 100;
      agreeableness = Math.round(agreeableness);

      var emotionalrange = jsonOutput[2]["tones"][4]["score"];
      emotionalrange *= 100;
      emotionalrange = Math.round(emotionalrange);

      emailText = '<html><body><h2>Original Email: </h2><p>' + watsonInput + '</p><h2>Results: </h2>' +
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
      '%</td></table>' + 
      '<p><i>Created by Kevin Burns and Brett Henderson</i></p></body></html>';

      console.log('EMAIL TEXT: '+ emailText);

      sparky.transmissions.send({
        transmissionBody: {
          content: {
            from: 'postmaster@idbolt.io',
            subject: 'Results!',
            html: '' + emailText,
            text: ''
          },
          recipients: [
          {address: email}
          ]
        }
      }, function(err, res) {
        if (err) {
          console.log('Whoops! Something went wrong');
          console.log(err);
        } else {
          console.log('message results from watson sent');
        }
      });

      ref.child(snapKey).remove();
    }});
});