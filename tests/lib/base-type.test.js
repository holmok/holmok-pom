const Tape = require('tape')
const Sinon = require('sinon')
const { SimpleObject, NoInitObject } = require('../fixtures/objects')

function pre () {
  const context = {}
  context.sandbox = Sinon.createSandbox()
  context.BaseType = require('../..').BaseType
  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('Create BaseType with no params fails.', (t) => {
  t.plan(1)
  const context = pre()
  const { BaseType } = context
  t.throws(() => new BaseType(), 'Create BaseType instance throws.')
  post(context)
})

Tape('SimpleObject', async (t) => {
  t.plan(1)
  const context = pre()
  const simple = new SimpleObject()
  await simple.init()
  t.ok(simple, 'SimpleObject instance created.')
  post(context)
})

Tape('NoInitObject', async (t) => {
  t.plan(1)
  const context = pre()
  const noInit = new NoInitObject()
  try {
    await noInit.init()
  } catch (e) {
    t.ok(e, 'Init failed.')
  }
  post(context)
})
