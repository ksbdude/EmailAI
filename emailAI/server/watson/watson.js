//firebase data input

var ref = new Firebase("https://watspark.firebaseio.com/raw-events/");
ref.orderByKey().on("child_added", function(snapshot) {
  var testThing = snapshot.val();
  console.log(snapshot.exportVal());
  watsonInput = snapshot.exportVal();
  return watsonInput;
});

//sparkpost input
tone_analyzer.tone({ text: 'watson is really wattson' },
  function(err, tone) {
    if (err)
      console.log(err);
    else {
      console.log(JSON.stringify(tone, null, 2));
  }});


function parseToEmail(response) {

}