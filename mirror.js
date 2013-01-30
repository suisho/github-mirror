var exec = require('child_process').exec
var spawn = require('child_process').spawn
var fs = require("fs")
var path = require("path")
var mkdirp = require("mkdirp")
var async = require("async");
module.exports = function(github, mirrorDir, options){
  // mirror all repos(series)
  var mirrorRepos = function(repos, cb){
    var tasks = [];
    repos.forEach(function(repo){
      tasks.push(function(next){
        mirror(repo, function(err){
          next();
        })
      })
    })
    async.series(tasks, function(err, result){
      cb(err, result)
    });
  }
  
  // mirror repo
  var mirror = function(repo, cb){
    console.log("[mirror]start  " + repo.full_name+ " mirroring");
    var project = repo.full_name
    var projectDir = path.resolve(path.join(mirrorDir, project))
    var bareProjectDir = projectDir + ".git";
    if(fs.existsSync(bareProjectDir)){
      fetch(bareProjectDir, cb);
      return;
    }
    
    var ownerDir = path.dirname(projectDir);
    if(!fs.existsSync(ownerDir)){
      mkdirp.sync(ownerDir)
    }
    var url = options.use_git_url ? repo.git_url : repo.ssh_url;
    clone(ownerDir, repo.git_url, cb);
  }

  return {
    user : function(user, option, cb){
      var param = {
        user : user
      }
      if(typeof cb != "function"){
        cb = function(){}
      }
      github.repos.getFromUser(param, function(err, repos){
        mirrorRepos(repos, cb);
      });
    },
  }
}

var command = function(command, option, cb){
  
  console.log(command);
  var _command = command.split(" ")
  var _c = _command.shift();
  var args = _command.concat();
  var cmd = spawn(_c, args, option);
  cmd.stdout.on('data',function(data){
    console.log(data.toString());
  });
  cmd.stderr.on('data',function(data){
    console.error(data.toString());
  });
  cmd.on('exit',function(code){
    cb(null, code);
  })
}
var fetch = function(dir, cb){
  var opt = {
    "cwd" : dir
  }
  command("git fetch --all", opt, function(err, code){
    cb(err)
  })
}
var clone = function(dir, url, cb){
  var opt = {
    "cwd" : dir
  }
  command("git clone --mirror --bare " + url, opt, function(err, code){
    cb(err)
  })
}
