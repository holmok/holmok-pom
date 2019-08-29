const { BaseType } = require('../..')

class SimpleObject extends BaseType {
  init () {
    // do stuff
  }
}

class NoInitObject extends BaseType {

}

module.exports = { SimpleObject, NoInitObject }
