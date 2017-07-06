function beforeRender(req, res, done) {
  //you can use a server side running script to load remote data
  //or do other template preprocessing
  //http://jsreport.net/learn/scripts
  req.data.generatedOn = new Date();
  done();
}