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



    var anger = jsonOutput[0]["tones"][0]["score"];
    anger *= 100;
    console.log("anger: " + anger);

    var disgust = jsonOutput[0]["tones"][1]["score"];
    disgust *= 100;
    console.log("disgust: " + disgust);

    var fear = jsonOutput[0]["tones"][2]["score"];
    fear *= 100;
    console.log("fear: " + fear);

    var joy = jsonOutput[0]["tones"][3]["score"];
    joy *= 100;
    console.log("joy: " + joy);

    var sadness = jsonOutput[0]["tones"][4]["score"];
    sadness *= 100;
    console.log("sandness: " + sadness);

    var analytical = jsonOutput[1]["tones"][0]["score"];
    analytical *= 100;

    var confident = jsonOutput[1]["tones"][1]["score"];
    confident *= 100;

    var tentative = jsonOutput[1]["tones"][2]["score"];
    tentative *= 100;

    emailText = '<html><body><h2>Original Email: </h2><p>' + watsonInput + '</p> <h2>Results: </h2> <h2>--Emotions--</h2><p>' +
    '<h3>Anger: </h3> <p>' +
    anger + '%' +
    '</p> <h3>Disgust: </h3> <p>' +
    disgust + '%' +
    '</p> <h3>Fear: </h3> <p>' +
    fear + '%' +
    '</p> <h3>Joy: </h3> <p>' +
    joy + '%' +
    '</p> <h3>Sadness: </h3> <p>' +
    sadness + '%' +
    '<h2>--Writing Tone--</h2>' +
    '</p> <h3>Analytical: </h3> <p>' +
    analytical + '%' +
    '</p> <h3>Confident: </h3> <p>' +
    confident + '%' +
    '</p> <h3>Tentative: </h3> <p>' +
    tentative + '%' +
    '</p><p><i>Created by Kevin Burns and Brett Henderson</i></p></body></html>';

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