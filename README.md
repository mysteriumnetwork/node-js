# Mysterium Client Binary Downloader
[Mysterium Node](https://github.com/MysteriumNetwork/node) client binary downloader

## Installation

#### Per project
```sh
$ npm i mysterium-client-bin
```

or

```sh
$ yarn add mysterium-client-bin
```

#### Globally
```sh
npm i mysterium-client-bin -g
```

or

```sh
yarn global add mysterium-client-bin
```

Unfortunately *yarn* doesn't support the *postinstall* hook, therefore you will need to run download the binaries manually:

```sh
yarn download-mysterium-client
```

We currently support x64 versions of _darwin_, _windows_, _linux_. To download a specific platform binary, run the following:

```sh
yarn download-mysterium-client windows <destination_dir (optinal)>
```

## Usage
To run the binary from your project root:

```sh
// ./node_modules/.bin/mysterium_client
$(npm bin)/mysterium_client
```

or

```sh
yarn mysterium_client
```

If you installed it globally, it should appear in your $PATH:

```sh
$ mysterium_client --help
```

