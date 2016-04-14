describe('testing gagarin', function() {
    var server = meteor();
    it('should just work', function() {
        return server.execute(function() {
            console.log('sup bro');
        });
    });
});

//tests for watson.js
describe('testing watson.js', function() {
    var server = meteor();
    it('returns watson/sparkpost output', function() {
        return server.execute(function() {
            Meteor.call(analayzeTone());
        });
    });


});
