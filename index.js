#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('follow-redirects').https;
const targz = require('targz');
const unzip = require('extract-zip');

const urlBase = 'https://github.com/mysteriumnetwork/node/releases';
const binaryName = 'myst';

const getFileName = function (osPathPart, archPathPart, extension) {
  return binaryName + '_' + osPathPart + '_' + archPathPart + extension
};

const getDownloadInfo = function (osType, architecture) {
  const pjson = require('./package.json');
  const version = pjson.version;

  osType = osType.toLowerCase();
  let osPathPart, archPathPart, extension, filename;
  if (architecture !== 'x64') throw new Error('Unsupported architecture: ' + architecture);
  archPathPart = 'amd64';
  switch (osType) {
    case 'linux':
    case 'darwin': extension = '.tar.gz'; osPathPart = osType.toLowerCase(); break;
    case 'windows':
    case 'windows_nt': extension = '.zip'; osPathPart = 'windows'; break;
    default: throw new Error('Unsupported os type: ' + osType)
  }
  filename = getFileName(osPathPart, archPathPart, extension);
  let url;
  if (version === "0.0.0-dev") {
    url = `${urlBase}/latest/download/${filename}`
  } else {
    url = `${urlBase}/download/${version}/${filename}`
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


const unpack = function (path, dest, format, cb) {
  if (format === 'zip') {
    unzip(path, {dir: dest}, cb);
    return
  }
  targz.decompress({
    src: path,
    dest
  }, cb)
};

const install = function (osType, architecture, destination) {
  const {url, filename} = getDownloadInfo(osType, architecture);
  download(url, filename, function (err) {
    if (err) return console.log(err);
    console.log('Downloaded', url);
    const format = osType.includes('windows') ? 'zip' : 'tar.gz';
    unpack(filename, destination, format, function (err) {
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
const osType = args[0] || os.type();
const osArch = 'x64';
const destination =  args[1] ? path.resolve(args[1]) : path.resolve(__dirname, './bin');

install(osType, osArch, destination);
