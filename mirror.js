var exec = require('child_process').exec
var fs = require("fs")
var path = require("path")
var mkdirp = require("mkdirp")
// clone --bare --mirror to /baseDir/owner/project or fetch
module.exports = function(baseDir, repoInfo, cb){
  var project = repoInfo.full_name
  var projectDir = path.resolve(path.join(baseDir, project))
  var bareProjectDir = projectDir+".git";
  if(fs.existsSync(bareProjectDir)){
    fetch(bareProjectDir, cb);
    return;
  }
  
  var ownerDir = path.dirname(projectDir);
  if(!fs.existsSync(ownerDir)){
    mkdirp.sync(ownerDir)
  }
  clone(ownerDir, repoInfo.git_url, cb);
}

var fetch = function(dir, cb){
  var opt = {
    "cwd" : dir
  }
  exec("git fetch --all", opt, function(err){
    cb(err)
  })
}
var clone = function(dir, url, cb){
  var opt = {
    "cwd" : dir
  }
  exec("git clone --mirror --bare " + url, opt, function(err){
    cb(err)
  })
}
