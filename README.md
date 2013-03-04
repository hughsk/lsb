# lsb [![Build Status](https://secure.travis-ci.org/hughsk/lsb.png?branch=master)](http://travis-ci.org/hughsk/lsb) #

Hide string data in the least-significant bits of an array. It's an easy way
of, say, storing information in images invisibly. Note that if you're trying
to hide something important you should probably use something else :)

## Installation ##

``` bash
$ npm install lsb
```

## Usage ##

`require('lsb').encode(channel, stegotext, [iterator])`

Where `channel` is the array to hide the `stegotext` string in. `iterator` is
an optional callback for determining the index of each hidden byte, if you want
to get tricky.

`require('lsb').decode(channel, [iterator])`

Once encodeded, use this on the same `channel` array to return the hidden
string. If you used an `iterator` callback before, you'll need to use it again
here or you'll get garbage text.
