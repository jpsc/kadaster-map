# App Utils component

## Functionality

Javascript utilities for global usage.

### app-utils-cookies

Utility for getting and setting cookies in the browser.
Here's the most common example (see more in app-utils-cookies.test.js):
```javascript
import Cookies from '../app-utils/app-utils-cookies';

Cookies.setCookie('cookieName', 'aRandomValue'); //Cookie is set
let cookieValue = Cookies.getCookie('cookieName');  //  cookieValue='aRandomValue'
```

You can see an usage of it in component user-my-user-datasource. But since this is a generic utility, any 
component that handles cookies can use it.


### app-utils-array-extensions

Utilities for jQuery arrays. 

`GetNextIndexCircular(currentIndex)` 

Returns next index to a given one. It's circular, so if the given index is bigger than the 
array, it starts again from the beginning. Example:

arr = $([1,2,3])
a = new ArrayExtensions(arr)

a.getNextIndexCircular(-1)   // -1 (the index needs to be zero or bigger)
a.getNextIndexCircular(0)    // 1
a.getNextIndexCircular(1)    // 2
a.getNextIndexCircular(2)    // 0
a.getNextIndexCircular(3)    // 1
a.getNextIndexCircular(4)    // 2
a.getNextIndexCircular(5)    // 0
a.getNextIndexCircular(2454) // 1

`getIndexBy(function)` 

Returns the index of the first element who matches the criteria (given function returns true)

Example:

arr = $(['a','b','c'])
a = new ArrayExtensions(arr)

a.getIndexBy(e => e === 'a') // 0
a.getIndexBy(e => e === 'b') // 1
a.getIndexBy(e => e === 'c') // 2
a.getIndexBy(e => e === 'd') // -1


This component is used in toggle-visibility.

### app-utils-browser-supports-animations

Detection for JS-based animation events


### app-utils-domain-detection

Returns true if the hostname contains the fundainbusiness string
Testing enviroments are also supported



