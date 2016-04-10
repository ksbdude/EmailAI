describe('testing gagarin', function () {
  var server = meteor();
  it('should just work', function () {
    return server.execute(function () {
      console.log('sup bro');
    });
  });
});
