var needle = require('needle')
var util = require('util')
var fs = require('fs')
// Constructor
function HODClient(apikey,version,staging) {
  // always initialize all instance properties
  if (apikey=='http://api.havenondemand.com' || apikey=='http://api.havenondemand.com/' || apikey=='https://api.havenondemand.com' || apikey=='https://api.havenondemand.com/') {
    throw new Error("Using an outdated wrapper constructor method. No need to include API URL.\nInclude as such:\n client = new havenondemand.HODClient(API_KEY, VERSION)")
  }
  if (version==undefined) {this.version="v1";}
  else {this.version=version;}
  this.apikey = apikey;
  if (staging==undefined || staging==false) {
    this.endpoint = "https://api.havenondemand.com/1/api/%s/%s/"+this.version;
  } else if (staging==true) {
      this.endpoint = "https://api.staging.havenondemand.com/1/api/%s/%s/"+this.version;
  }
  this.getJobResultEndpoint = "https://api.havenondemand.com/1/job/result/%s?apikey=%s"
  this.getJobStatusEndpoint = "https://api.havenondemand.com/1/job/status/%s?apikey=%s"
}
// class methods

needle.defaults({ timeout: 120000});


parseArgs=function(arg1,arg2,arg3){
  var data,callback,async;
  if (typeof arg1 == "function") {callback = arg1;}
  else if (typeof arg1 == "object") {data=arg1;}
  else {async=arg1;}

  if (typeof arg2 == "function") {callback = arg2;}
  else if (typeof arg2 =="object") {data=arg2;}
  else {async=arg2;}

  if (typeof arg3 == "function") {callback = arg3;}
  else if (typeof arg3 =="object") {data=arg3;}
  else {async=arg3;}

  return {'data':data,'callback':callback,'async':async}
}

parseArgsCheckStatusResult=function(arg1,arg2){
  var jobID,callback;
  if (typeof arg1 == "function") {callback = arg1;}
  else if (typeof arg1 == "string") {jobID = arg1;}

  if (typeof arg2 == "function") {callback = arg2;}
  else if (typeof arg2 == "string") {jobID = arg2;}

  return {'jobID':jobID,'callback':callback};
}

HODClient.prototype.call = function(handler,arg1,arg2,arg3) {
  var args=  parseArgs(arg1,arg2,arg3)
  var data= args.data;
  var callback= args.callback;
  var async=args.async;
  if (typeof async =="undefined") async = false;
  if (typeof data =="undefined") data={};

  if (data["file"]){
    data["file"]={'file':data["file"],'content_type':'multipart/form-data'}
  }
//  console.log('incall',data)
  async_string="sync";
  data.apikey=this.apikey;


  if (async) {
    async_string="async";
  }

  var url = util.format(this.endpoint,async_string,handler);
  //console.log(url)

  if (typeof callback == "undefined") {

  return needle.post(url, data, { multipart: true });
  }
  else{

    if (async){
      var callback = callback;
      var callbackmanager=function(err,resp,body){
        body={'async':true,'data':body};
        body.status

        callback(err,resp,body);
      }
    }
    else{
      var callbackmanager= callback;
    }
    needle.post(url, data, { multipart: true }, callbackmanager);

  }

};

HODClient.prototype.getJobResult = function(arg1,arg2) {
  var args=  parseArgsCheckStatusResult(arg1,arg2)
  var jobID= args.jobID;
  var callback= args.callback;

  var url = util.format(this.getJobResultEndpoint, jobID, this.apikey);

  if (typeof callback == "undefined") {
    return needle.get(url);
  }
  else {
    return needle.get(url, callback);
  }
}

HODClient.prototype.getJobStatus = function(arg1,arg2) {
  var args=  parseArgsCheckStatusResult(arg1,arg2)
  var jobID= args.jobID;
  var callback= args.callback;

  var url = util.format(this.getJobStatusEndpoint, jobID, this.apikey);

  if (typeof callback == "undefined") {
    return needle.get(url);
  }
  else {
    return needle.get(url, callback);
  }
}


HODClient.prototype.createIndex=function(name,arg1,arg2,arg3){
  var args=  parseArgs(arg1,arg2,arg3)
  var data= args.data;
  var callback= args.callback;
  var async=args.async;

  if (typeof data =="undefined") data = {};
  data.index=name
  console.log("setting",data)
  return this.call('createtextindex',callback,data)
}

HODClient.prototype.getIndex=function(name){
    return new HODIndex(this,name)
}

HODClient.prototype.deleteIndex=function(name,arg1,arg2,arg3){
  var args=  parseArgs(arg1,arg2,arg3)
  var data= args.data;
  var callback= args.callback;
  var async=args.async;
  data.index=name
  var callback=callback;
  var self=this;

  var confirmcallback=function(err,resp,body){
    console.log('confirmcall')
    console.log(JSON.stringify(body))
    data.confirm=body.confirm
    self.call('deletetextindex',callback,data)
  }

  this.call('deletetextindex',confirmcallback,data)
}


function HODIndex(client,name){
  this.client=client;
  this.name=name;
}

HODIndex.prototype.retrieveindexfields=function(callback){
  data={'indexes':this.name}
  return this.client.call('retrieveindexfields',callback,data)
}

HODIndex.prototype.status=function(callback){
  data={'indexes':this.name}
  return this.client.call('indexstatus',callback,data)
}

HODIndex.prototype.delete=function(callback){
  data={'indexes':this.name}
  return this.client.call('deletetextindex',callback,data)
}

HODIndex.prototype.deletedocs=function(callback,data){
  data.indexes=this.name
  return this.client.call('deletetextindex',callback,data)
}

HODIndex.prototype.create=function(callback,data){
  if (typeof data == "undefined") data={'flavor':'standard'}
  data.index=this.name
  return this.client.call('createtextindex',callback,data)
}

HODIndex.prototype.adddocs=function(callback,docs,data){
  data.indexes=this.name
  docs={'document':docs}
  data.json=JSON.stringify(docs)
  return this.client.call('addtotextindex',callback,data)
}


function HODConnector(client,name){
  this.client=client;
  this.name=name;
}

HODConnector.prototype.start=function(callback){
  data={'connector':this.name}
  return this.client.call('startconnector',callback,data)
}

HODConnector.prototype.status=function(callback){
  data={'connector':this.name}
  return this.client.call('connectorstatus',callback,data)
}

HODConnector.prototype.retrieveconfig=function(callback){
  data={'connector':this.name}
  return this.client.call('retrieveconfig',callback,data)
}

HODConnector.prototype.updateconnector=function(callback,data){
  data.connector=this.name
  return this.client.call('updateconnector',callback,data)
}

HODConnector.prototype.delete=function(callback){
  data={'connector':this.name}
  return this.client.call('deleteconnector',callback,data)
}

// export the class
exports.HODClient=HODClient
exports.HODConnector=HODConnector
exports.HODIndex=HODIndex
