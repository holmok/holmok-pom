class BaseObject {
  constructor () {
    // cannot create an instance on BaseObject
    if (this.constructor.name === 'BaseObject') {
      throw new Error('Cannot create an instance on BaseObject. Extend it with a new child class.')
    }
  }
}

module.exports = { BaseObject }
