const fs = require("fs");
const path = require("path");

/**
 * 删除指定目录下的所有文件
 * @param {*} path
 */
function deleteFile(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

/**
 * 创建目录
 * @param {*} dirname
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 拷贝文件夹
 * @param {*} src
 * @param {*} dest
 */
function copyDirectory(src, dest) {
    console.log('create:', dest);
    
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  if (!fs.existsSync(src)) {
    return false;
  }
  var dirs = fs.readdirSync(src);
  dirs.forEach(function (item) {
    var item_path = path.join(src, item);
    var temp = fs.statSync(item_path);
    if (temp.isFile()) {
      // 是文件
      fs.copyFileSync(item_path, path.join(dest, item));
    } else if (temp.isDirectory()) {
      // 是目录
      copyDirectory(item_path, path.join(dest, item));
    }
  });
}

exports.mkdirsSync = mkdirsSync;
exports.deleteFile = deleteFile;
exports.copyDirectory = copyDirectory;
