# Mysterium Binary Downloader

[Mysterium Node](https://github.com/MysteriumNetwork/node) binary downloader

## Installation

#### Per project
```sh
$ npm i @mysteriumnetwork/node
```

or

```sh
$ yarn add @mysteriumnetwork/node
```

#### Globally
```sh
npm i @mysteriumnetwork/node -g
```

or

```sh
yarn global add @mysteriumnetwork/node
```

Unfortunately *yarn* doesn't support the *postinstall* hook, therefore you will need to download the binaries manually:

```sh
yarn myst-download
```

We currently support x64 versions of _darwin_, _windows_ and _linux_. To download for a specific platform, run the following:

```sh
yarn myst-download <destination_dir (optinal)>
```

## Usage
To run the binary from your project root:

```sh
// ./node_modules/.bin/myst
$(npm bin)/myst
```

or

```sh
yarn myst
```

If you installed it globally, it should appear in your $PATH:

```sh
$ myst --help
```
