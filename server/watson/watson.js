//firebase data input

var watson = Meteor.npmRequire('watson-developer-cloud');

var SparkPost = Meteor.npmRequire('sparkpost');
var sparky = new SparkPost('a6f9c6da23d308a74890919b5d2a644ad475f033');

var watsonInput;
var emailText;
var watsonOutput;

var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");

ref.orderByKey().limitToLast(1).on("child_added", function(snapshot) {
  var child = snapshot.val();
  console.log(snapshot.key());

  snapshot.child("0/msys/relay_message/content/").forEach(function(snap){
    console.log('snap ' + snap.val());
    if(snap.key() === 'text'){
      watsonInput = snap.val();
    }
  });


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
    console.log('WATSON TONE: ' + JSON.stringify(tone, null, 2));
    watsonOutput = JSON.stringify(tone, null, 2);
  }});

emailText = '<html><body><h2>Original Email: </h2><p>' + watsonInput + '</p> <h2>Results: </h2><p>' + watsonOutput + ' </p></body></html>';
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
    {address: 'kevinscottburns@gmail.com'}
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

});