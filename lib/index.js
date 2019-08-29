const { Pool } = require('pg')
const Memcached = require('memcached')
const { BaseType } = require('./base-type')
const debug = require('debug')('pom:pom')

class POM {
  constructor ({ pg, memcached } = {}) {
    this.pool = new Pool(pg)
    this.cache = new Memcached(memcached)
    this.types = new Map()
  }

  async register (...types) {
    for (const Type of types) {
      debug('Registering type: %s', Type.name)
      if (Type.prototype instanceof BaseType) {
        const type = new Type()
        this.types.set(Type.name, await type.init(this))
      } else {
        throw new Error('You can only register types that extend BaseType.')
      }
    }
  }

  async close () {
    this.cache.end()
    await this.pool.end()
  }
}

module.exports = { POM }
