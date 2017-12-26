module.exports = function (limit, uoPort, diPort) {
  if (typeof limit === 'undefined') {
    limit = Infinity
  }
  uoPort = uoPort || 'UO'
  diPort = diPort || 'DI'

  var observed = 0
  var history = []
  var pending = null
  var done = false
  var i = 0
  var request = null

  function processPending (done) {
    var cb
    if (done && pending) {
      cb = pending
      pending = null
      cb(done)
    } else if (history.length > 0 && pending) {
      cb = pending
      pending = null
      cb(false, history.shift())
    }
  }

  function events (abort, x) {
    if (done) return x && x(done)
    else if (abort) {
      done = abort
      processPending(done)
      history = []
      if (x) x(abort)
      return
    } else if (history.length > 0) return x(false, history.shift())
    else if (x && pending) throw new Error('Unsupported concurrent ask requests')
    else if (observed >= limit) {
      done = true
      x(done)
    } else pending = x
  }
  function output (abort, cb) {
    ++i
    if (!request) throw new Error('Uninitialized input')
    else if (done) return cb(done)
    else if (!abort) {
      history.push({
        port: diPort,
        type: 'request',
        request: 'ask',
        i: i,
        cb: true
      })
    } else if (abort instanceof Error) {
      history.push({
        port: diPort,
        type: 'request',
        request: 'error',
        i: i,
        err: abort,
        cb: !!cb
      })
    } else {
      history.push({
        port: diPort,
        type: 'request',
        request: 'abort',
        i: i,
        cb: !!cb
      })
    }
    observed++

    setImmediate(function () { processPending(false) })

    request(abort, function (iDone, v) {
      if (done) return

      if (!iDone) {
        history.push({
          port: uoPort,
          type: 'answer',
          answer: 'value',
          i: i,
          v: v
        })
      } else if (iDone instanceof Error) {
        history.push({
          port: uoPort,
          type: 'answer',
          answer: 'error',
          i: i,
          err: iDone.message
        })
      } else if (iDone) {
        history.push({
          port: uoPort,
          type: 'answer',
          answer: 'done',
          i: i
        })
      }
      observed++

      setImmediate(function () { processPending(false) })
      if (iDone) return cb(iDone)
      cb(iDone, v)
    })
  }
  function input (req) {
    request = req
  }

  return {
    source: output,
    sink: input,
    events: events
  }
}
