const { Pool } = require('pg')
const Memcached = require('memcached')
const { BaseType } = require('./base-type')
const Methods = require('./methods')
const debug = require('debug')('pom:pom')

class POM {
  constructor ({ pg, memcached } = {}) {
    const pool = new Pool(pg)
    const cache = new Memcached(memcached)
    this.methods = Methods(pool, cache)
    this.types = new Map()
  }

  async register (...types) {
    for (const Type of types) {
      debug('Registering type: %s', Type.name)
      if (Type.prototype instanceof BaseType) {
        const type = new Type()
        this.types.set(Type.name, await type.init(this.methods))
      } else {
        throw new Error('You can only register types that extend BaseType.')
      }
    }
  }

  async close () {
    await this.methods.close()
  }
}

module.exports = { POM }
