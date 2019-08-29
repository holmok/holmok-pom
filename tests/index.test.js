const Tape = require('tape')

function pre () {
  const context = {}
  context.lib = require('../')
  return context
}

Tape('Library exports expected items.', (t) => {
  t.plan(2)
  const context = pre()
  const { POM, BaseType } = context.lib
  t.ok(POM, 'POM class exported.')
  t.ok(BaseType, 'BaseType class exported.')
})
