### 1.2.2 -> 1.2.3
* Fixed ```hasSubscribers```, should now return correct value

### 1.2.1 -> 1.2.2
* Fixed types export
```js
import { Middleware, AnySubCallback, ... } from 'suby'
```

### 1.2.0 -> 1.2.1
* Fixed jest y18n vulnerability

### 1.1.0 -> 1.2.0
* Added support for middleware via ```registerMiddleware``` and ```unregisterMiddleware```
* Added ```hasSubscribers``` method to check if the instance has registered subscribers
* removed data argument requirement for ```pub``` methtod
* Minor fixes