var watson = Meteor.npmRequire('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: '5d2c5f1e-fbe2-4aa6-8186-2c9a6dd9f9aa',
  password: 'xPYobQo1AZdx',
  version: 'v3-beta',
  version_date: '2016-02-11'
});


//sparkpost input
tone_analyzer.tone({ text: 'watson is stupid' },
  function(err, tone) {
    if (err)
      console.log(err);
    else
      console.log(JSON.stringify(tone, null, 2));
      watsonData = {JSON.stringify(tone, null, 2)};
});
