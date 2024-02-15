/**
 * Copyright (c) 2024 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const RedisClass = require('ioredis');

class Redis extends RedisClass {
  constructor(opts) {
    super(opts);
  }

  __getPayload(data) {
    let type = typeof data;

    if (Buffer.isBuffer(data)) {
      type = 'buffer';
      // make into base64
      data = data.toString('base64');
    }

    return JSON.stringify({ type, data });
  }

  async getObj(key) {
    try {
      key = this.getKey(key);
      // console.log(key);
      let { type, data } = await this.get(key).then(JSON.parse);

      // format based on type
      if (type == 'buffer') {
        data = Buffer.from(data, 'base64');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async setObj(key, data, {  expires = null } = {}) {
    try {
      key = this.getKey(key);

      let payload = this.__getPayload(data);

      await this.set(key, payload);

      // set expires
      if (expires && typeof expires == 'number') {
        await this.expire(key, expires);
      }
    } catch (error) {
      throw error;
    }
  }

  getKey(key, ) {
    let keyArr = arrify(key);
    keyArr = keyArr.filter((v) => v && String(v).length > 0);
    return keyArr.join(':');
  }
}

function arrify(v) {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

module.exports = Redis;
