const Tape = require('tape')
const Sinon = require('sinon')
const Proxyquire = require('proxyquire')
const { SimpleObject } = require('../fixtures/objects')
const Methods = require('../../lib/methods')

function pre () {
  const context = {}
  const { stub, mock } = context.sandbox = Sinon.createSandbox()

  const Pool = context.pool = stub()
  const Cache = context.cache = stub()

  const methods = Methods(Pool, Cache)
  context.methodsMock = mock(methods)

  context.POM = Proxyquire(
    '../../lib', {
      memcached: Cache,
      pg: { Pool },
      './methods': () => methods
    }
  ).POM
  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('POM [constructor]', (t) => {
  t.plan(3)
  const context = pre()
  const { POM } = context
  const pom = new POM()
  t.ok(context.pool.calledWithNew(), 'new Pool() called.')
  t.ok(context.cache.calledWithNew(), 'new Cached() called.')
  t.ok(pom, 'Created POM instance.')
  post(context)
})

Tape('POM [close]', async (t) => {
  const context = pre()
  context.methodsMock.expects('close').once().resolves()
  const { POM } = context
  const pom = new POM()
  await pom.close()
  post(context)
  t.pass('Closed called.')
  t.end()
})

Tape('POM [register] (happy)', async (t) => {
  const context = pre()
  const { POM } = context
  const pom = new POM()
  await pom.register(SimpleObject, SimpleObject)
  await pom.register(SimpleObject)
  post(context)
  t.pass('Success.')
  t.end()
})

Tape('POM [register] (fail)', async (t) => {
  t.plan(1)
  const context = pre()
  const { POM } = context
  const pom = new POM()
  try {
    await pom.register(() => {})
  } catch (e) {
    t.ok(e, 'Init failed.')
  }
  post(context)
})
