var mirror = require("./mirror")
var api = require("./api")({})
var async = require("async");

var mirrorUser = function(user, cb){
  api.getRepos(user, function(err, repositories){
    mirrorRepos(repositories, cb);
  });
};

var mirrorRepos = function(repositories, cb){
  var tasks = [];
  repositories.forEach(function(repo){
    tasks.push(function(next){
      console.log("start  " + repo.full_name+ " mirroring");
      mirror(mirrorDir, repo, function(err){
        if(err) console.log(err);
        console.log("finish " + repo.full_name+ " mirroring");
        next();
      })
    })
  })
  async.series(tasks, function(err, result){
    cb(err, result)
  });
}


var users = ["suisho", "gruntjs"]
var mirrorDir = "./test2"
var userTask = [];

users.forEach(function(user){
  userTask.push(function(next){
    mirrorUser(user, function(){
      next()
    })
  })
  
})
async.series(userTask, function(){
  console.log("finished");
});
