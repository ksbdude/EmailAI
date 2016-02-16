//firebase data input

var watsonInput = "text";

var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");

ref.orderByKey().limitToLast(1).on("child_added", function(snapshot) {
  var child = snapshot.val();
  watsonInput = child.text;

  var watson = Meteor.npmRequire('watson-developer-cloud');

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
        console.log(JSON.stringify(tone, null, 2));
         watsonOutput = JSON.stringify(tone, null, 2);
            var SparkPost = Meteor.npmRequire('sparkpost');
    var sparky = new SparkPost('eb5e8fde469ca2f150b28539eeccee8100b99e1f');

    var emailText = '<html><body><h1>Original Email: </h1><p>' + watsonInput + '</p> <h1>Results: </h1><p>' + JSON.stringify(tone.document_tone.tone_categories.tones, null, 2) + ' </p></body></html>';

    sparky.transmissions.send({
      transmissionBody: {
        content: {
          from: 'postmaster@idbolt.io',
          subject: 'Oh hey!',
          html: '' + emailText,
          content: watsonOutput //append watson data
        },
        recipients: [
          {address: 'kevinscottburns@gmail.com'} //append original sender address as recipient
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
    }});
});
