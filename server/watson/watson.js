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
    console.log('snap ' + snap.val());
    if(snap.key() === 'text'){
      watsonInput = snap.val();
    }
  });

  snapshot.child("0/msys/relay_message/").forEach(function(snap){
    console.log('email: ' + snap.val());
    if(snap.key() === 'msg_from'){
      email = snap.val();
    }
    //call to remove current snapshotKey
  });



//these should be stored in env.keys
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
    jsonOutput = JSON.parse(tone, null, 2);
  }});


  //JSON to HTML table
  //taking unstringed json object and parsing, then breaking down each part of the object

  //parse the JSON so we can access what we need
  //var parsed = JSON.parse(jsonOutput);

  //get the amount of objects inside 'watson_tone' so we can loop through each one
  var count = Object.keys(watsonOutput.watson_tone).length;

  //strings to include in input
  var tableHeader = "<table><tr><th>score</th><th>tone_id</th></tr>";
  var tableContent = "";

  //loop through the JSON and output each row in to a string
  for (i = 0; i < count; i++) {
      tableContent = tableContent + "<tr><td>" + parsed.watson_tone[i].score + "</td><td>" + parsed.watson_tone[i].tone_id + "</tr>";
  }
  var tableFooter = "</table>";

  //get div and output the HTML. can include these strings straight into emailText
  document.getElementById("json_table").innerHTML = tableHeader + tableContent + tableFooter;

emailText = '<html><body><h2>Original Email: </h2><p>' + watsonInput + '</p> <h2>Results: </h2><p>' + jsonOutput + ' </p></body></html>';
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
});
