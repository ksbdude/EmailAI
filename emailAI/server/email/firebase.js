var Firebase = Meteor.npmRequire('firebase');

function watSpark() {
  constructor(url) {
    this.db = new Firebase(url)
  }
}

function processBatch(batch) {
  batch.forEach(rawEvent => {
    const [eventGrouping] = Object.keys(rawevent.msys);
    const event = rawEvent.myss[eventgrouping];
    if ( eventgrouping === 'relay_message') {
      this.processRelaymessage(event)
    }
    else {
      this.processEvent(event)
    }
  });
}

function processEvent(event) {
  console.log('processing #{ event.type } not allowed');
}

 function processRelayMessage(event) {
  const local = event.rcpt_to.split('@')[0]
  this.db.child(local).push({
    email: event.msg_from,
    friendly: event.friendly_from,
    subject: event.content.subject
  })
}

function listen(child) {
  this.db.child(child).on('child_added', (snapshot) => {
    this.processBatch(snapshot.val());
    this.db.child('raw-events').child(snapshot.key()).remove()
  });
}
}

watSpark = new watSpark('https://watspark.firebaseio.com/')
watSpark.listen('raw-events');
