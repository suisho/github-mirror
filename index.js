var GithubApi = require("github")

var Mirror = module.exports = function(config){
  var github = new GitHubApi({
    
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
  });
}
