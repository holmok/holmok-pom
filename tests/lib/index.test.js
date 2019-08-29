const Tape = require('tape')
const Sinon = require('sinon')
const Proxyquire = require('proxyquire')
const { SimpleObject } = require('../fixtures/objects')

function pre () {
  const context = {}
  const { stub } = context.sandbox = Sinon.createSandbox()
  const Pool = context.pool = stub()
  Pool.prototype.end = context.poolEnd = stub()
  const Cache = context.cache = stub()
  Cache.prototype.end = context.cacheEnd = stub()
  context.POM = Proxyquire(
    '../../lib', {
      memcached: Cache,
      pg: { Pool }
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
  t.plan(2)
  const context = pre()
  context.poolEnd.resolves()
  context.cacheEnd.returns()
  const { POM } = context
  const pom = new POM()
  await pom.close()
  t.ok(context.poolEnd.calledOnce, 'pool.end() called.')
  t.ok(context.cacheEnd.calledOnce, 'cached.end() called.')
  post(context)
})

Tape('POM [register] (happy)', async (t) => {
  const context = pre()
  context.poolEnd.resolves()
  context.cacheEnd.returns()
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
  context.poolEnd.resolves()
  context.cacheEnd.returns()
  const { POM } = context
  const pom = new POM()

  try {
    await pom.register(() => {})
  } catch (e) {
    t.ok(e, 'Init failed.')
  }

  post(context)
})
