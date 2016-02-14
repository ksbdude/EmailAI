//firebase data input

var watsonInput;
var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");
ref.orderByKey().on("child_added", function(snapshot) {
  var testThing = snapshot.val();
  console.log(snapshot.exportVal());
   watsonInput = snapshot.exportVal();
  return watsonInput;
});

//sparkpost input
tone_analyzer.tone({ text: watsonInput },
  function(err, tone) {
    if (err)
      console.log(err);
    else {
      console.log(JSON.stringify(tone, null, 2));
  }});


var watson = Meteor.npmRequire('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: '5d2c5f1e-fbe2-4aa6-8186-2c9a6dd9f9aa',
  password: 'xPYobQo1AZdx',
  version: 'v3-beta',
  version_date: '2016-02-11'
});


//sparkpost input
tone_analyzer.tone({ text: 'text' },
  function(err, tone) {
    if (err)
      console.log(err);
    else {
      console.log(JSON.stringify(tone, null, 2));
    }});

function parseToEmail(response) {

}
