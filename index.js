#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('follow-redirects').https;
const targz = require('targz');
const unzip = require('extract-zip');

const REPO_RELEASES = 'https://github.com/mysteriumnetwork/node';
const REPO_SNAPSHOTS = 'https://github.com/mysteriumnetwork/node-builds';
const BINARY_NAME = 'myst';
// Mapping between Node's `process.platform` to Golang's
const PLATFORM_MAPPING = {
  "darwin": "darwin",
  "linux": "linux",
  "win32": "windows",
};
// Mapping from Node's `process.arch` to Golang's `$GOARCH`
const ARCH_MAPPING = {
  "ia32": "386",
  "x64": "amd64",
  "arm": "arm"
};

const getDownloadInfo = function () {
  if (!(os.platform in PLATFORM_MAPPING)) {
    throw new Error("Unsupported OS platform: " + os.platform);
  }
  let platform = PLATFORM_MAPPING[os.platform];

  if (!(os.arch in ARCH_MAPPING)) {
    throw new Error("Unsupported OS architecture: " + os.arch);
  }
  let arch = ARCH_MAPPING[os.arch];

  let extension = platform === 'windows' ? '.zip' : '.tar.gz';
  let filename = BINARY_NAME + '_' + platform + '_' + arch + extension;

  let pjson = require('./package.json');
  let version = pjson.version;

  let url;
  if (version === "0.0.0-dev.2") {
    url = `${REPO_SNAPSHOTS}/releases/latest/download/${filename}`
  } else {
    url = `${REPO_RELEASES}/releases/download/${version}/${filename}`
  }
  return {
    url: url,
    filename,
    extension
  }
};

let download = function (url, dest, cb) {
  let file = fs.createWriteStream(dest);
  https.get(url, function (response) {
    file.on('finish', function () {
      file.close(cb);
    });
    if (response.statusCode >= 400) {
      if (cb) cb(new Error(`Unsuccessful HTTP status: ${url} ${response.statusCode} ${response.statusMessage}`));
      return
    }
    response.pipe(file);
  }).on('error', function (err) {
    fs.unlinkSync(dest);
    if (cb) cb(err);
  });
};


const unpack = function (path, dest, extension, cb) {
  if (extension === '.zip') {
    unzip(path, {dir: dest}, cb);
    return
  }
  targz.decompress({
    src: path,
    dest
  }, cb)
};

const install = function (destination) {
  const {url, filename, extension} = getDownloadInfo();
  download(url, filename, function (err) {
    if (err) return console.log(err);
    console.log('Downloaded'  , url);
    unpack(filename, destination, extension, function (err) {
      if (err) return console.error(err);
      console.log('Unpacked to ', destination);
      fs.unlink(filename, (err) => {
        if (err) return console.error(err);
        console.log('Deleted', filename);
      })
    })
  });
};

const [,, ...args] = process.argv;
const destination =  args[1] ? path.resolve(args[1]) : path.resolve(__dirname, './bin');
install(destination);
