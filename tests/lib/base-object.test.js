const Tape = require('tape')
const Sinon = require('sinon')

function pre () {
  const context = {}
  context.sandbox = Sinon.createSandbox()
  context.BaseObject = require('../../').BaseObject
  context.SimpleObject = require('../fixtures/simple-object').SimpleObject
  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('Create BaseObject with no params fails.', (t) => {
  t.plan(1)
  const context = pre()
  const { BaseObject } = context
  t.throws(() => new BaseObject(), 'Create BaseObject instance throws.')
  post(context)
})

Tape('Create extension of BaseObject with no params.', (t) => {
  t.plan(1)
  const context = pre()
  const { SimpleObject } = context
  const simple = new SimpleObject()
  t.ok(simple, 'SimpleObject instance created.')
  post(context)
})
