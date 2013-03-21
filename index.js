var spaceCode = ' '.charCodeAt(0)

function stringToBits(str) {
  var bits = []

  for (var i = 0, l = str.length; i < l; i += 1) {
    var character = str[i]
      , number = str.charCodeAt(i)

    // Non-standard characters are treated as spaces
    if (number > 255) number = spaceCode

    // Split the character code into bits
    for (var j = 7; j >= 0; j -= 1) {
      bits[i * 8 + 7 - j] = (number >> j) & 1
    }
  }

  return bits
}

function bitsToString(bits) {
  var str = ''
    , character

  for (var i = 0, l = bits.length; i < l; i += 8) {
    character = 0
    for (var j = 7; j >= 0; j -= 1) {
      character += bits[i + 7 - j] << j
    }
    str += String.fromCharCode(character)
  }

  return str
}

function encode(channel, stegotext, fn) {
  fn = fn || function index(n) { return n }

  var i = 0
    , channelLength = channel.length
    , stegoLength
    , textLength
    , index

  textLength = stegotext.length
  stegotext = stringToBits(stegotext)
  stegoLength = stegotext.length

  // Encode length into the first 4 bytes
  channel[fn(0)] = (textLength >> 32) & 255
  channel[fn(1)] = (textLength >> 24) & 255
  channel[fn(2)] = (textLength >> 16) & 255
  channel[fn(3)] = (textLength >>  8) & 255

  while (i < channelLength && i < stegoLength) {
    index = fn(i + 4)
    if (index < 0) break
    channel[index] = (channel[index] & 254) + (stegotext[i] ? 1 : 0)
    i += 1
  }

  return channel
}

function decode(channel, fn) {
  fn = fn || function index(n) { return n }

  var i = 0
    , l = 0
    , stegotext = []
    , index

  for (var n = 0; n < 4; n += 1) {
    l += channel[fn(n)] << n * 8
  }
  l = Math.min(l * 8, channel.length)

  while (i < l) {
    index = fn(i + 4)
    if (index < 0) break
    stegotext[i] = (channel[index] & 1) ? 1 : 0
    i += 1
  }

  return bitsToString(stegotext)
}

module.exports = {
  encode: encode
, decode: decode
, bitsToString: bitsToString
, stringToBits: stringToBits
}
