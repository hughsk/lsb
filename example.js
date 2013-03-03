var debounce = require('debounce')
  , lsb = require('./')
  , encode = lsb.encode
  , decode = lsb.decode

var input = document.getElementById('input').getContext('2d')
  , output = document.getElementById('output').getContext('2d')
  , highlighted = document.getElementById('highlighted').getContext('2d')
  , enlarged = document.getElementById('enlarged').getContext('2d')
  , textarea = document.getElementById('text')

;[input, output, highlighted, enlarged].forEach(function(c) {
  c.canvas.width = 256
  c.canvas.height = 256
})

var lenna = new Image
lenna.onload = function() {
  ;[input, output].forEach(function(c) {
    c.drawImage(lenna, 0, 0, c.canvas.width, c.canvas.height)
  })
  updateText()
}
lenna.src = 'img/lenna.png'

textarea.onkeyup =
textarea.onchange = updateText

function updateText() {
  var stegotext = textarea.value + ''
    , imageData = input.getImageData(0, 0, input.canvas.width, input.canvas.height)

  // Encode image data - ignoring the alpha channel
  // as it would interfere with the RGB channels
  function rgb(n) {
    return n + (n/3)|0
  }
  encode(imageData.data, stegotext, rgb)

  output.putImageData(imageData, 0, 0)

  // Highlight LSBs
  for (var i = rgb(4), l = imageData.data.length; i < l; i += 1) {
    imageData.data[i] = imageData.data[i] & 1 ? 255 : 0
  }
  highlighted.putImageData(imageData, 0, 0)

  // Enlarge the first 100 bits of the image,
  // with R/G/B on seperate pixels
  for (var x = 0; x < 64; x += 1) {
    for (var y = 0; y < 64; y += 1) {
      var val = imageData.data[rgb(x+y*64)]

      enlarged.fillStyle = 'rgb('
        + val + ','
        + val + ','
        + val + ')'

      enlarged.fillRect(x * 8, y * 8, 8, 8)
    }
  }
}

updateText = debounce(updateText, 50, true)
