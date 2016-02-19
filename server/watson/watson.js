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



    var anger = jsonOutput['document_tone']['tone_categories'][0]["tones"][0]["score"];
    console.log("anger: " + anger);

    var disgust = jsonOutput['document_tone']['tone_categories'][0]["tones"][1]["score"];
    console.log("disgust: " + disgust);

    var fear = jsonOutput['document_tone']['tone_categories'][0]["tones"][2]["score"];
    console.log("fear: " + fear);

    var joy = jsonOutput['document_tone']['tone_categories'][0]["tones"][3]["score"];
    console.log("joy: " + joy);

    var sadness = jsonOutput['document_tone']['tone_categories'][0]["tones"][4]["score"];
    console.log("sandness: " + sadness);

    emailText = '<html><body><h2>Original Email: </h2><p>' + watsonInput + '</p> <h2>Results: </h2><p>' + "Anger: " + anger +  "\n Disgust: " + disgust +  "\n Fear: " + fear +  "\n Joy: " + joy +  "\n Sadness: " + sadness + ' </p></body></html>';

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