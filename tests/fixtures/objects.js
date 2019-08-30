const { BaseType } = require('../..')

class SimpleObject extends BaseType {
  init (methods) {
    // do stuff
  }
}

class NoInitObject extends BaseType {

}

module.exports = { SimpleObject, NoInitObject }
