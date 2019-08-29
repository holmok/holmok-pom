class BaseType {
  constructor () {
    // cannot create an instance on BaseType
    if (this.constructor.name === 'BaseType') {
      throw new Error('Cannot create an instance on BaseType. Extend it with a new child class.')
    }
  }

  async init () {
    throw new Error('Not Implemented.')
  }
}

module.exports = { BaseType }
