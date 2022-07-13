#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('follow-redirects').https;
const targz = require('targz');
const unzip = require('extract-zip');
const semver = require('semver');
const packageJson = require('./package.json');

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
  "arm": "arm",
  "arm64": "arm64",
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
  let version = packageJson.version;

  let url;
  switch (version) {
    case "0.0.0-snapshot.1":
      url = `https://github.com/mysteriumnetwork/node-builds/releases/latest/download/${filename}`
      break
    case "0.0.0-mainnet":
      url = `https://github.com/mysteriumnetwork/nightly/releases/latest/download/${filename}`
      break
    default:
      // Allows releasing additional versions of this package for the same node version, e.g.:
      // 2.9.2-p1 (node-js) -> 2.9.2 (node)
      let nodeVersion = semver.coerce(version).version;
      url = `https://github.com/mysteriumnetwork/node/releases/download/${nodeVersion}/${filename}`
  }
  return { url, filename, extension }
};

const download = async function (url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      file.on('finish', () => file.close(() => resolve(dest)))
      if (response.statusCode >= 400) {
        reject(new Error(`Unsuccessful HTTP status: ${url} ${response.statusCode} ${response.statusMessage}`))
      }
      response.pipe(file)
    }).on('error', err => {
      fs.unlinkSync(dest)
      reject(err)
    })
  })
};

const unpack = async function (path, dest, extension) {
  if (extension === '.zip') {
    return unzip(path, {dir: dest});
  }
  return new Promise(resolve => {
    targz.decompress({
      src: path,
      dest
    }, () => {
      resolve()
    })
  })
};

async function install(destination) {
  const {url, filename, extension} = getDownloadInfo();
  try {
    await download(url, filename)
    console.log(`Downloaded ${url} to ${filename}`)
    await unpack(filename, destination, extension)
    console.log(`Unpacked to ${destination}`);
    fs.unlink(filename, (err) => {
      if (err) return console.error(err);
      console.log('Deleted', filename);
    })
  } catch (err) {
    console.error(`Failed to install:`, err)
    return
  }
}

const [,, ...args] = process.argv;
const destination =  args[1] ? path.resolve(args[1]) : path.resolve(__dirname, './bin');
install(destination);
