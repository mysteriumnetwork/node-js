# Mysterium Binary Downloader

[Mysterium Node](https://github.com/MysteriumNetwork/node) binary downloader

## Installation

```sh
$ npm i @mysteriumnetwork/node
```

or

```sh
$ yarn add @mysteriumnetwork/node
```

After installing the package, Mysterium Node binaries will be available at `node_modules/@mysteriumnetwork/node/bin`.  
You can use `postinstall` hook to move them to a desired location, e.g.:

```
  "scripts": {
    "postinstall": "shx rm -rf static/bin && shx cp -r node_modules/@mysteriumnetwork/node/bin static/bin",
    ...
  },
```

We currently support x64 versions of _darwin_, _windows_ and _linux_.

## Usage

You can check out Mysterium VPN desktop client for source code examples on running the Mysterium Node and/or Mysterium Node Supervisor using these binaries:  
https://github.com/mysteriumnetwork/mysterium-vpn-desktop/blob/master/src/supervisor/supervisor.ts
