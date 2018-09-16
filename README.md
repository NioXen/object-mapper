# Object Mapper
## Introduction
This was a total learning effort as I wanted to practice using ORM's but quickly realised I needed
a way to get my JSON objects into decorated classes.

After scouring github I found [this project]{https://github.com/jf3096/json-typescript-mapper} which
did almost exactly what I needed... But I didn't understand how it worked at all! So I decided to
try and replicate this functionality (consulting their great code for help) to help understand.
They have slightly different behaviour but the linked solution is more elegant and configurable than
this one, I **highly** recommend you check them out before this!

## This though, how does it work?
Decorators are explained in the [TypeScript docs]{https://www.typescriptlang.org/docs/handbook/decorators.html}.
This project also uses [reflect-metadata]{https://www.npmjs.com/package/reflect-metadata}.

The decorators are strucutured like: 
```
@MapProperty<T>({
    name?: string,
    _class?: { new (): T };
})
```
If only providing a name, a shorthand is provided:
```
@MapProperty(name: string)
```
This will map property values from a source object onto a target object.
It respects the following rules:
- Decorated properties will be mapped by 'name' if provided, otherwise by key.
- Decorated properties will be recursively mapped if they are themselves classes.
- Decorated arrays will be mapped in the same way, but a _class must be provided (otherwise they will not be mapped).

## So how can **I** use it?
Just import the main file into your project and call the `mapObject` method:
```
import ObjectMapper from "../src/ObjectMapper";

const mappedObject = ObjectMapper.mapObject(target, source);
```
Where target is the decorated class type and source is the object with the properties to be extracted.

### The poor documentation ends here
