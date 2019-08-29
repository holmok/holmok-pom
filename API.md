# API Documentation for @holmok/pom

- [POM](#pom)
- [BaseType](#BaseType)

----

# POM

`POM` is a class that allows you to access objects mapped in postgresql

### Constructor

```javascript
const { POM } = require('pom')
const pom = new POM({pg, memcached})
```

Creates an instance of postgresql object mapper.

#### Parameters

- `pg`: Configuration for [pg](https://www.npmjs.com/package/pg).
- `memcached`:  Configuration for [memcached](https://www.npmjs.com/package/memcached).

----

## Instance Methods

### __pom.end()__
```javascript
await pom.close()
```

Closes postgresql object mapper. Cleans up postgresql connection pool and memcached connections.

#### Returns
Returns a promise to await close() to finish.

----

### __pom.register(...types)__
```javascript
pom.register(Type1, Type2, ... TypeN)
```

Registers types for objects to be mapped in postgresql.

#### Parameter
A list of classes that extend [BaseType](#BaseType).

#### Throws
Will throw an error if any of the types are not an instance of [BaseType](#BaseType) or if the type's default constructor throws an error.

----


# BaseType

`BaseType` is a base class you extend to describe objects mapped in postgresql

### Example

```javascript
const { BaseType } = require('pom')
class MyObject extends BaseType {
  async init(pom) {
    // do stuff to initialize
  }
}
```

### Constructor

```javascript
const { BaseType } = require('pom')
class MyObject extends BaseType {
  constructor(){
    super()
    // do stuff
  }
  ...
}
```

The default constructor is call called when registering types in the library

----

## Instance Methods

### __pom.end()__
```javascript
await pom.close()
```

Closes postgresql object mapper. Cleans up postgresql connection pool and memcached connections.

#### Returns
Returns a promise to await close() to finish.

----