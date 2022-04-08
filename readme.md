Suby
===

Suby is a tiny publish-subscibe library.

# Installation
```bash
$ npm i -S suby
$ yarn add suby
```

# Methods
```sub, subscribe, listen, on```: (namespace, callback) - subscribes to messages in a namespace and returns unsubscribe function.

```pub, publish, emit```: (namespace, data?) - publish data to namespace.

```unsub, off```: (namespace, callback) - unsubscribes from messages in a namespace.

```onAny```: (callback) - subscribe to messages in all namespaces and returns unsubscribe function.

```offAny```: (calllback) - unsubscribes from messages in all namespaces.

```hasSubscribers```: returns Boolean weather the store has registered subscribers.

```hasSubscriber```: (namespace, callback?) - returns Boolean weather there are subscribers or specific subscriber in provided namespace.

```registerMiddleware```: (Middleware | Middleware[]): register middleware callbacks that will be called with event name and data
Each middleware must return original or mutated data. Next middleware and callbacks willl be called with the new data.

```unregisterMiddleware```: (Middleware | Middleware[]): unregister middleware.

# Usage
```js
import Suby from 'suby'

const mySubyInstance = new Suby()

const unSub = mySubyInstance.sub('new-user', (userName) => {
    console.log(`Hello ${userName}!`)
})

const offAny = mySubyInstance.onAny((event, data) => {
    console.log('received new event', event, data)
})

mySubyInstance.pub('new-user', 'John')
// received new event new-user John
// Hello John!

unSub() // unsubscribe from future events in 'new-user' namespace
offAny() // unsubscribe from future events in all namespaces

mySubyInstance.pub('new-user', 'Homer') // nothing happens

//using middleware
function myLoggerMiddleware(event, data){
    console.log(`Logger`, event, data)
    return data // return data!
}

mySubyInstance.registerMiddleware(myLoggerMiddleware)

mySubyInstance.pub('new-user', 'Bob')
// Logger new-user Bob

// or with on/off pattern
function onPing(){
    console.log('PING')
}

mySubyInstance.on('ping', onPing)
mySubyInstance.off('ping', onPing)

```

# Examples
```js
// subscribe for single event
const eventBus = new Suby()

const unSub = eventBus.sub('assets-loaded', (error) => {
    unSub()
    // do some stuff...
})
```

```ts
type Events = {
	'event-a': string
	'event-b': number
	'event-c': undefined
}

const pubSub = new PubSub<Events>()

pubSub.on('event-a', 'hello')
```
