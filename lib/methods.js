function methods (pool, cache) {
  return {
    async query (sql, params) {
      const client = await pool.connect()
      const result = await client.query(sql, params)
      client.release()
      return result
    },
    touch (key, ttl) {
      return new Promise((resolve, reject) => {
        cache.touch(key, ttl, (error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    },
    get (key) {
      return new Promise((resolve, reject) => {
        cache.get(key, (error, data) => {
          if (error) reject(error)
          else resolve(data)
        })
      })
    },
    getMulti (key) {
      return new Promise((resolve, reject) => {
        cache.getMulti(key, (error, data) => {
          if (error) reject(error)
          else resolve(data)
        })
      })
    },
    set (key, data, ttl) {
      return new Promise((resolve, reject) => {
        cache.set(key, data, ttl, (error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    },
    del (key) {
      return new Promise((resolve, reject) => {
        cache.del(key, (error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    },
    flush () {
      return new Promise((resolve, reject) => {
        cache.flush((error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    },
    async close () {
      cache.end()
      await pool.end()
    }
  }
}

module.exports = methods
