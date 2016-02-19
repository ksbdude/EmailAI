//firebase data input

var watson = Meteor.npmRequire('watson-developer-cloud');

var SparkPost = Meteor.npmRequire('sparkpost');
var sparky = new SparkPost('a6f9c6da23d308a74890919b5d2a644ad475f033');

var watsonInput;
var emailText;
var watsonOutput;
var email;

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


//lanaguage processing for multi-language translation from watson
var language_translation = watson.language_translation({
  //temp settings for testing
  username: '5d2c5f1e-fbe2-4aa6-8186-2c9a6dd9f9aa',
  password: 'xPYobQo1AZdx',
  version: 'v2'
});

//identify the language to be passed into translation
language_translation.identify({ text: "" + watsonInput },
  function(err, identifiedTranslation){
    if (err){
      console.log('FAILED TO IDENTIFY LANGUAGE');
    } else {
      console.log(identifiedTranslation);
    }
  }
})


//handles our translation and passes to watsonInput
// language_translation.translate({
//   //
//   //
//   function(err, transle){
//     if (err){
//       console.log(err);
//     } else {
//       console.log(translate);
//     }
//   }
// });

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
  }});

//JSON2HTML
var json2html = Meteor.npmRequire('node-json2html');
//transformer formats the JSON data into HTML
var transformer = {"tag":"div","id":"${document_tone}","children":[
    {"tag":"div","id":"${tone_categories}","children":[
        {"tag":"div","id":"${tones}","children":[
            {"tag":"span","html":" ${score}"},
            {"tag":"span","html":"tone_id: ${tone_id}"},
            {"tag":"span","html":"tone_name ${tone_name}"}
          ]}
      ]}
  ]};

//watson output formatted in HTML
//var handleInput = Template.handleInput.onRendered = function(){

//};

var jsonFormated = json2html.transform(watsonOutput,transformer);
//debugging, remove colors package
console.log('JSON FORMATTED: ' + jsonFormated);

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
