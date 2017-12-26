# pull-stream-protocol-reifier

Produces a stream from the pull-stream protocol events happening during the interaction between two modules.

# Usage

````
reifier = require('pull-stream-protocol-reifier')
probe = reifier(?limit, ?uoPort, ?diPort)
````

# Example

````
reifier = require('pull-stream-protocol-reifier')
probe = reifier()

pull(
  pull.count(3),
  probe,
  pull.drain()
)

pull(
  probe.events,
  pull.drain(console.log)
)

/* Prints:
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
*/

````

# Event format

Events correspond to the request or answers of the pull-stream callback protocol.

## Requests

````
  {
    port: String, // (default: 'DI')
    type: 'request', 
    request: 'ask',
    i: Number, // (>= 1)
    cb: true
  }
````

````
  {
    port: String, // (default: 'DI')
    type: 'request',
    request: 'abort', 
    i: Number, // (>= 1)
    cb: Boolean // (true if a callback was provided, false otherwise)
  }
````

````
  {
    port: String, (default: 'DI')
    type: 'request',
    request: 'error',
    i: Number, // (>= 1)
    err: Error, 
    cb: Boolean // (true if a callback was provided, false otherwise)
  }
````

## Answers

````
  {
    port: String, // (default: 'UO')
    type: 'answer',
    answer: 'value', 
    i: Number, // (>= 1)
    v: Object 
  }
````

````
  {
    port: String, // (default: 'UO')
    type: 'answer',
    answer: 'done', 
    i: Number // (>= 1)
  }
````

````
  {
    port: String, // (default: 'UO')
    type: 'answer',
    answer: 'error', 
    i: Number, // (>= 1)
    err: String
  }
````
