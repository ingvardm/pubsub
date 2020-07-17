Suby
===

Suby is a tiny publish-subscibe library.

```bash
$ npm i -S suby
$ yarn add suby
```

```js
import Suby from 'suby'

const mySubyInstance = new Suby()

const unSub = mySubyInstance.sub('new-user', (userName) => {
    console.log(`Hello ${userName}!`)
})

mySubyInstance.pub('new-user', 'John') // printts 'Hello John!'

unSub() // unsubscribe from future events

mySubyInstance.pub('new-user', 'Homer') // nothing happens

```
