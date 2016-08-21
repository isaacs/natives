var t = require('tap')
var natives = require('../')

t.test('fs is like fs but not fs', function (t) {
  var fs = require('fs')
  var nfs = natives.require('fs')
  t.notEqual(nfs, fs)
  var f = nfs.readFileSync(__filename, 'utf8')
  var w = fs.readFileSync(__filename, 'utf8')
  t.equal(f, w, 'reads the file the same')
  t.end()
})

t.test('fall back to normal require', function (t) {
  t.equal(natives.require('./not-a-node-internal/.'), undefined)
  t.end()
})
