const Tape = require('tape')
const Sinon = require('sinon')
const Methods = require('../../lib/methods')

Tape('Methods (happy)', async (t) => {
  t.plan(12)

  const client = {
    query: Sinon.stub().withArgs('sql', 'params').resolves('query.result'),
    release: Sinon.stub().returns()
  }
  const pool = {
    connect: Sinon.stub().resolves(client),
    end: Sinon.stub().resolves()
  }
  const cache = {
    touch: Sinon.stub().withArgs('key', 123).callsArg(2),
    get: Sinon.stub().withArgs('key').callsArgWith(1, undefined, 'cache.get'),
    getMulti: Sinon.stub().withArgs(['key', 'another']).callsArgWith(1, undefined, 'cache.getMulti'),
    set: Sinon.stub().withArgs('key', 'data', 123).callsArg(3),
    del: Sinon.stub().withArgs('key').callsArg(1),
    flush: Sinon.stub().callsArg(0),
    end: Sinon.stub().returns()
  }

  const methods = Methods(pool, cache)

  const result1 = await methods.query('sql', 'params')
  t.ok(client.query.called, "Called with 'sql', 'params' once.")
  t.equal(result1, 'query.result', 'Got query result.')

  await methods.touch('key', 123)
  t.ok(cache.touch.called, "Touch called with 'key', 123.")

  const result2 = await methods.get('key')
  t.ok(cache.get.called, "Get called with 'key'.")
  t.equal(result2, 'cache.get', 'Got cache.get result.')

  const result3 = await methods.getMulti(['key', 'another'])
  t.ok(cache.get.called, "Get Multi called with ['key', 'another'].")
  t.equal(result3, 'cache.getMulti', 'Got cache.getMulti result.')

  await methods.set('key', 'data', 123)
  t.ok(cache.set.called, "Set called with 'key', 'data', 123.")

  await methods.del('key')
  t.ok(cache.del.called, "Del called with 'key'.")

  await methods.flush()
  t.ok(cache.flush.called, 'Flush called.')

  await methods.close()
  t.ok(cache.end.called, 'Touch end called.')
  t.ok(pool.end.called, 'Pool end called.')
})

Tape('Methods (cache rejections)', async (t) => {
  t.plan(6)
  const pool = {}
  const cache = {
    touch: Sinon.stub().withArgs('key', 123).callsArgWith(2, new Error('failed touch')),
    get: Sinon.stub().withArgs('key').callsArgWith(1, new Error('failed get')),
    getMulti: Sinon.stub().withArgs(['key', 'another']).callsArgWith(1, new Error('failed getMulti')),
    set: Sinon.stub().withArgs('key', 'data', 123).callsArgWith(3, new Error('failed set')),
    del: Sinon.stub().withArgs('key').callsArgWith(1, new Error('failed del')),
    flush: Sinon.stub().callsArgWith(0, new Error('failed flush'))
  }

  const methods = Methods(pool, cache)
  try {
    await methods.touch('key', 123)
  } catch (e) {
    t.equal(e.message, 'failed touch', "Got 'failed touch' error.")
  }

  try {
    await methods.get('key')
  } catch (e) {
    t.equal(e.message, 'failed get', "Got 'failed get' error.")
  }

  try {
    await methods.getMulti(['key', 'another'])
  } catch (e) {
    t.equal(e.message, 'failed getMulti', "Got 'failed getMulti' error.")
  }

  try {
    await methods.set('key', 'data', 123)
  } catch (e) {
    t.equal(e.message, 'failed set', "Got 'failed set' error.")
  }

  try {
    await methods.del('key')
  } catch (e) {
    t.equal(e.message, 'failed del', "Got 'failed del' error.")
  }

  try {
    await methods.flush()
  } catch (e) {
    t.equal(e.message, 'failed flush', "Got 'failed flush' error.")
  }
})
