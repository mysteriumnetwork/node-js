# Mysterium Node binary downloader

[Mysterium Node](https://github.com/MysteriumNetwork/node) binary downloader downloads binary assets needed to run a Mysterium Node.

Useful links:

- [Javascript SDK](https://github.com/mysteriumnetwork/mysterium-vpn-js) for controlling a running Mysterium Node through API
- [Mysterium VPN Desktop client](https://github.com/mysteriumnetwork/mysterium-vpn-desktop) - reference implementation

## Installation

```sh
$ npm i @mysteriumnetwork/node
```

or

```sh
$ yarn add @mysteriumnetwork/node
```

After installing the package, Mysterium Node binaries will be available at `node_modules/@mysteriumnetwork/node/bin/${platform}/${arch}`.  
You can use `postinstall` hook to move them to a desired location, e.g.:

```
  "scripts": {
    "postinstall": "shx rm -rf static/bin && shx cp -r node_modules/@mysteriumnetwork/node/bin static/bin",
    ...
  },
```

We currently support the following platforms/architectures:
- x64: windows, linux, macOS
- arm64: linux, macOS

## Usage

You can check out Mysterium VPN desktop client for source code examples on running the Mysterium Node and/or Mysterium Node Supervisor using these binaries:  
https://github.com/mysteriumnetwork/mysterium-vpn-desktop/blob/master/src/supervisor/supervisor.ts
