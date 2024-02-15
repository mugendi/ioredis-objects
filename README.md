<!--
 Copyright (c) 2024 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# ioredis-objects

This module extends the [ioredis](https://www.npmjs.com/package/ioredis) class in order to allow you to work with objects easily. This means you can cache objects and files in redis without worrying about how the data is encoded and decoded.

This is achieved by:

1. Detecting the `type` of data.
2. Encoding the data to a form that redis can handle. `JSON.stringify` for `objects` and `Buffer.toString('base64')` for buffers.
3. We then save the `type` alongside the encoded data.
4. We therefore know how to decode the data to it's original form when it is read from redis.

## How to use

```javascript
const Redis = require('ioredis-objects');
const redis = new Redis();
const fs = require('fs');
const assert = require('assert');

(async () => {
  // read file as a buffer
  let origData = fs.readFileSync('./package.json');
  // Note: 👆 could also be an object/array, as long as its JSON serializable

  // Use a name-spaced key
  const redisKey = ['prefix', 'test-key', 1];

  // save buffer to redis
  await redis.setObj(redisKey, buff);

  // get back the buffer from redis
  let readData = await redis.getObj(redisKey);

  // check that they match
  assert.deepStrictEqual(origData, readData);
})();
```

## API

### `async setObj(key:String|Number|Array, data:Any, options:{expires:Number})`

### `async getObj(key:String|Number|Arrayy)`

### `getKey(key:String|Number|Array)`

This method is exposed so you can construct the name-spaced keys for purposes of action like key deletion.

Example:

```javascript
const redisKey = ['prefix', 'test-key', 1];
const nsKey = redis.getKey(redisKey);
await redis.del(nsKey);
```

#### Note:

1. The redis key can be a `string`, `number` or `array`. The key is first serialized to a name-spaced string before it is used. For example: `['prefix','test-key', 1]` becomes `prefix:test-key:1`.

2. You can add an `expires` option which automatically adds an expiry `redis.expire` to the key.

3. The module adds two methods `getObj` and `setObj`. This leaves all other methods available in ioredis untouched so you can use it as a drop-in replacement of ioredis.
