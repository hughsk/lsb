var test = require('tape')
  , clone = require('clone')
  , lsb = require('./')

function makeChannel() {
  var channel = []
  for (var i = 0, l = 256*256; i < l; i += 1) {
    channel[i] = (Math.random()*256)|0
  }
  return channel
}

test('encodes and decodes', function(t) {
  t.plan(2)

  var channel = makeChannel()
    , stegotext = 'Hello world, lorem ipsum dolor sit amet quartes zum.'

  t.notEqual(lsb.decode(channel), stegotext)
  t.equal(lsb.decode(lsb.encode(channel, stegotext)), stegotext)
})

test('accepts iterator function for indexes', function(t) {
  t.plan(3)

  var channel = makeChannel()
    , stegotext = 'Hello world, lorem ipsum dolor sit amet quartes zum.'
    , iterated
    , vanilla

  function iterator(n) {
    return n * 4
  }

  vanilla = lsb.encode(clone(channel), stegotext)
  iterated = lsb.encode(clone(channel), stegotext, iterator)

  // Different encoded results
  t.notDeepEqual(vanilla, iterated)

  // Equal when decoded
  t.equal(
    lsb.decode(vanilla)
  , lsb.decode(iterated, iterator)
  )

  // Compare encoding points
  t.doesNotThrow(function() {
    stegotext.split('').map(function(character, i) {
      if ((vanilla[(i + 4)] & 1) !== (iterated[iterator(i + 4)] & 1)) throw new Error('Not matching')
    })
  })
})
