# lsb #

Hide string data in the least-significant bits of an array.

## Installation ##

``` bash
$ npm install lsb
```

## Usage ##

`require('lsb').encode(channel, stegotext, [iterator])`

Where `channel` is the array to hide the `stegotext` string in. `iterator` is
an optional callback for determining the index of each hidden byte, if you want
to get tricky.
