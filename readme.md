Suby
===

Suby is a tiny publish-subscibe library.

# Installation
```bash
$ npm i -S suby
$ yarn add suby
```

# Methods
```sub, subscribe, listen, on```: (namespace, callback) - subscribes to messages in a namespace and returns unsubscribe function

```pub, publish, emit```: (namespace, data) - publish data to namespace

```unsub, off```: (namespace, callback) - unsubscribes from messages in a namespace


# Usage
```js
import Suby from 'suby'

const mySubyInstance = new Suby()

const unSub = mySubyInstance.sub('new-user', (userName) => {
    console.log(`Hello ${userName}!`)
})

mySubyInstance.pub('new-user', 'John') // printts 'Hello John!'

unSub() // unsubscribe from future events

mySubyInstance.pub('new-user', 'Homer') // nothing happens

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
