var url = require("url")
var request = require("request")

module.exports = function(config){
  var apiUrl = config.api_url || "https://api.github.com";
  var accessToken = config.access_token

  // simple get
  var get = function(path, callback){
    var urlObj = url.parse(url.resolve(apiUrl,path));
    urlObj.query = {
    }
    if(accessToken){
     urlObj.query.access_token = accessToken
    }
    request(url.format(urlObj), function(err, response, body){
      callback(err,  JSON.parse(body))
    })
  }
  
  //api list
  return {
    getRepos : function(user, callback){
      var path = "users/"+user+"/repos";
      get(path, callback)
    }
  }
  
}
