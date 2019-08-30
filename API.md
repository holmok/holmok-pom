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

### __`pom.close()`__
```javascript
await pom.close()
```

Closes postgresql object mapper. Cleans up postgresql connection pool and memcached connections.

#### Returns
Returns a promise to await close() to finish.

----

### __`pom.register(...types)`__
```javascript
pom.register(Type1, Type2, ...TypeN)
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
class MyType extends BaseType {
}
```

### Constructor

```javascript
const { BaseType } = require('pom')
class MyType extends BaseType {
  constructor(){
    super()
    // do stuff
  }
  ...
}
```

The default constructor is call called when registering types in the library.

----

## Instance Methods

### __`type.init(methods)`__
```javascript
const { BaseType } = require('pom')
class MyType extends BaseType {
  ...
  async init(methods){
    // do stuff
  }
  ...
}
```

An asynchronous function called when registering types in the library. Then `methods` parameter passed in gives raw access to postgresql and memcached via asynchronous helper methods.

#### `methods` parameter

All methods are promise based.

| Method  | Parameter | Description | Resolves |
|---|---|---|---|
| methods.query  | `sql`, `params`  | runs a `sql` query in postgresql with `params`   | postgresql results (from pg npm library)  |
| methods.touch  | `key`, `ttl`(seconds)  | touches item in cache at `key` resetting the ttl  | void  |
| methods.get  | `key`  |  fetches item in cache at `key` | item from cache  |
| methods.getMulti  | [`keys`]  | fetches items in cache from items in array of [`keys`] | items from cache  |
| methods.set  | `key`,`value`,`ttl`(seconds)  |  sets item in cache at `key` with ttl and value |  void |
| methods.del  | `key`  | deletes item in cache at `key`  |  void |
| methods.flush  |  n/a | removes all items from cache  |  void |


----