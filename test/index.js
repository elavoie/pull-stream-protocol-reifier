var tape = require('tape')
var pull = require('pull-stream')
var reifier = require('../')
var debug = require('debug')
var log = debug('pull-stream-protocol-reifier')

tape('README example', function (t) {
  var probe = reifier()

  pull(
    pull.count(3),
    probe,
    pull.drain(null, function () { t.end() })
  )

  pull(
    probe.events,
    pull.drain(log)
  )
})

tape('Example application', function (t) {
  var expected = [
    { port: 'DI', type: 'request', request: 'ask', i: 1, cb: true },
    { port: 'UO', type: 'answer', answer: 'value', i: 1, v: 0 },
    { port: 'DI', type: 'request', request: 'ask', i: 2, cb: true },
    { port: 'UO', type: 'answer', answer: 'value', i: 2, v: 1 },
    { port: 'DI', type: 'request', request: 'ask', i: 3, cb: true },
    { port: 'UO', type: 'answer', answer: 'value', i: 3, v: 2 },
    { port: 'DI', type: 'request', request: 'ask', i: 4, cb: true },
    { port: 'UO', type: 'answer', answer: 'value', i: 4, v: 3 },
    { port: 'DI', type: 'request', request: 'ask', i: 5, cb: true },
    { port: 'UO', type: 'answer', answer: 'done', i: 5 }
  ]

  var probe = reifier()

  var i = 0
  pull(
    probe.events,
    pull.drain(function (e) {
      t.deepEquals(e, expected[i++])
      if (i === expected.length) t.end()
    })
  )

  pull(
    pull.count(3),
    probe,
    pull.drain()
  )
})
