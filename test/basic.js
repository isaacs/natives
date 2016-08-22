var natives = require('../')
var buf = natives.require('buffer')

var t = require('tap')
t.test('it doesnt break buffers and streams', function (t) {
  var code = [
    'require(process.argv[1]).require("buffer")',
    'process.stdin.pipe(process.stdout)'
  ].join('\n')

  var spawn = require('child_process').spawn
  var node = process.execPath
  var args = ['-e', code, require.resolve('../')]
  var opts = {
    stdio: [ 'pipe', 'pipe', 2 ]
  }
  var child = spawn(node, args, opts)
  var out = ''
  child.stdout.on('data', function (c) {
    out += c
  })
  child.stdin.write('ok\n')
  child.stdin.end()
  child.on('close', function (exit, signal) {
    t.notOk(exit, 'exit success')
    t.notOk(signal, 'no signal')
    t.equal(out, 'ok\n')
    t.end()
  })
})

t.test('fs is like fs but not fs', function (t) {
  var fs = require('fs')
  var nfs = natives.require('fs')
  t.notEqual(nfs, fs)
  var f = nfs.readFileSync(__filename, 'utf8')
  var w = fs.readFileSync(__filename, 'utf8')
  t.equal(f, w, 'reads the file the same')
  t.end()
})

t.test('handle not-found modules with grace', function (t) {
  t.equal(natives.require('./not-a-node-internal/.'), undefined)
  t.end()
})
