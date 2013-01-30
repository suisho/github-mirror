var async = require("async");
var github = require('github')({
  version : "3.0.0",
});


var users = ["suisho", "gruntjs"]
var ignorePattern = "";
var mirrorDir = "./test2"
var mirror = require("./mirror")(github, mirrorDir,{});
var userTask = [];

users.forEach(function(user){
  userTask.push(function(next){
    api.mirror(user, {}, function(){
      next()
    })
  })
})
async.series(userTask, function(){
  console.log("finished");
});
