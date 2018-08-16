# Mysterium Client
[Mysterium Node](https://github.com/MysteriumNetwork/node) client published on [npmjs.com](https://www.npmjs.com)

## Installation
`$ npm i mysterium-client-bin -g`

or

`$ yarn add mysterium-client-bin`

in case you're using *yarn*, which doesn't support *postinstall* step
you will need to run it manually:

```sh
yarn add mysterium-client
yarn download-mysterium-client
```

You might also like to download binaries for other OS:

```sh
download-mysterium-client windows destination_dir
```

Currently supporting x64 of _darwin_, _windows_, _linux_

## Usage
In case you include *mysterium-client-bin* in your dependencies, you would be able
to run the binary from *./node_modules/.bin/mysterium_client*

```sh
$(npm bin)/mysterium_client
```

or

```sh
yarn mysterium_client
```

If you installed it globally with `$ npm i mysterium-client-bin -g` then it should appear in your path:

`$ mysterium_client --help`

