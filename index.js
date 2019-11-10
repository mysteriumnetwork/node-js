const fs = require('fs');

const https = require('follow-redirects').https;
const targz = require('targz');
const unzip = require('extract-zip');

const pjson = require('./package.json');
const version = pjson.version;

const urlBase = 'https://github.com/MysteriumNetwork/node/releases/download/';
const binaryName = 'myst';

const getFileName = function (osPathPart, archPathPart, extension) {
  return binaryName + '_' + osPathPart + '_' + archPathPart + extension
};

const getDownloadInfo = function (version, osType, architecture) {
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
  return {
    url: urlBase + version + '/' + filename,
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
    fs.unlink(dest);
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

module.exports = function (osType, architecture, destination) {
  const {url, filename} = getDownloadInfo(version, osType, architecture);
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
