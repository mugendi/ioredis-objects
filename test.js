/**
 * Copyright (c) 2024 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const test = require('node:test');
const assert = require('assert');

const Redis = require('.');
const redis = new Redis();
const fs = require('fs');

test('set & get buffer ', async (t) => {
  const redisKey = 'test-buffer';
  let buff = fs.readFileSync('./package.json');
  // set data
  await redis.setObj(redisKey, buff);
  // try get
  let buff2 = await redis.getObj(redisKey);

  // remove key
  await redis.del(redisKey);

  assert.deepStrictEqual(buff, buff2);
});

test('set & get object ', async (t) => {
  const redisKey = 'test-object';
  let obj = require('./package.json');

  // set data
  await redis.setObj(redisKey, obj);
  // try get
  let obj2 = await redis.getObj(redisKey);

  // remove key
  await redis.del(redisKey);

  assert.deepStrictEqual(obj, obj2);
});

// process.exit()
