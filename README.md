# Typesafe-ish Object Mapper

![Travis (.com)](https://img.shields.io/travis/com/NioXen/typesafe-mapper.svg)
[![Coverage Status](https://coveralls.io/repos/github/NioXen/typesafe-mapper/badge.svg?branch=master)](https://coveralls.io/github/NioXen/typesafe-mapper?branch=master)
![GitHub tag](https://img.shields.io/github/tag/NioXen/typesafe-mapper.svg)

___
## Introduction
This was a total learning effort as I wanted to practice using ORM's but quickly realised I needed
a way to get my JSON objects into orm decorated classes. This means that this is *extremely* opinionated regarding the things it will and will not map (and return types as the note explains below).

After checking out github I found [this project](https://github.com/jf3096/json-typescript-mapper) which
did almost exactly what I needed... But I didn't understand how it worked at all! So I decided to
try and replicate this functionality (consulting their great code for help) to help my understanding.
They have slightly different behaviour but the linked solution is more elegant and configurable than
this one, I **highly** recommend you check them out before this!
___
## This though, how does it work?
Decorators are explained in the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/decorators.html).
This project also uses [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).

**Be warned** there is a liberal use of `null` in this project. I have read in many places that this is poor practice, but this was specifically created to be used in conjuction with an orm. I figured that I would leave the null checking to the orm rather than throwing undefined around.
___

## The Decorators
Any decorated property will be mapped. The decorator function accepts either an object (with optional properties `name` and `_class`), a string (which will become `name` internally), or no arguments.

The definition for the decorator is:
```
@MapProperty<T>({
    name?: string,
    _class?: { new (): T };
})
```
It can be used on the following ways:

* `@MapProperty()` to map by key with no support for arrays.
* `@MapProperty('foo')` to map a property from the source object with key `foo`.
* `@MapProperty({_class: Bar})` to map an array property where each element will be mapped based on decorated class `Bar`.
* `@MapProperty({name: foo, _class: Bar})` to map an array property from the source object with key `foo` where each element is the decorated class `Bar`.

`_class` only needs to be provided for array properties. This is because in it's current form, Typescript decorators do not capture the underlying type of array elements. If this changes, this will become obselete.

## The Logic
If `_class` is not provided but an array is decorated, an `Error` will be thrown.

If an array on the source object is an array of primitives then `_class` must be the corresponding boxed primitive; but these will still be mapped using their primitive type. Example:
```
class PrimitivesArray {
  @MapProperty({ _class: String })
  array1: string[] = [];
}
const srcObj = {
    array1: ["foo", "bar"]
}
const mappedObj = Mapper.mapObject(PrimitivesArray, srcObj);
const console.log(typeof mappedObj.array1[0]);
// returns string
```
When mapping non-array properties by key, it is sufficient to decorate properties with `@MapProperty()` and no further arguments.

### The Nulls
`null` will be returned from `.mapObject` if either of the arguments are `null` or `undefined`.

A decorated property will be set to null :
* If addressing it on the source object returns `undefined`.
* If the primitive types do not match.

A decorated array will have it's elements set to null when the corresponding array element on the source object does not match the declared type.
___

## So how can **I** use it?
To decorate your class:
```
import { MapProperty } from 'typesafe-mapper'

class exampleClass {
    @MapProperty()
    name: string
}

```
Just import the main file into your project and call the `mapObject` method:
```
import Mapper from 'typesafe-mapper';

const mappedObject = Mapper.mapObject(targetClass, sourceObject);
```
Where targetClass is the decorated class type and source is the object with the properties to be extracted.
___
### The poor documentation ends here
