const Tape = require('tape')
const Sinon = require('sinon')

function pre () {
  const context = {}
  context.sandbox = Sinon.createSandbox()
  context.POM = require('../../').POM
  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('Create POM with no params.', (t) => {
  t.plan(1)
  const context = pre()
  const { POM } = context
  const pom = new POM()
  t.ok(pom, 'Created POM instance.')
  post(context)
})
