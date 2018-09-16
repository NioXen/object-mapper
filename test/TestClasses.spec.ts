import { MapProperty } from "../src/ObjectMapper";

export class BasicPrimitives {
  @MapProperty()
  name: string = "";
  @MapProperty()
  id: number = 0;
  @MapProperty()
  isValid: boolean = false;
}
export class NamedPrimitives {
  @MapProperty("name")
  nname: string = "";
  @MapProperty("id")
  iid: number = 0;
  @MapProperty("isValid")
  iisValid: boolean = false;
}
export class BasicObject {
  @MapProperty()
  class1: BasicPrimitives = new BasicPrimitives();
}
export class NamedObject {
  @MapProperty("class1")
  clas1: BasicPrimitives = new BasicPrimitives();
}
export class PrimitivesArray {
  @MapProperty({ _class: String })
  array1: String[] = [];
}
export class NamedPrimitivesArray {
  @MapProperty({ name: "array1", _class: String })
  aarray1: String[] = [];
}
export class ObjectsArray {
  @MapProperty({ _class: BasicPrimitives })
  objArray1: BasicPrimitives[] = [];
}
export class NamedObjectsArray {
  @MapProperty({ name: "objArray1", _class: BasicPrimitives })
  oobjArray1: BasicPrimitives[] = [];
}
export class UnDecoratedPrimitives {
  name: string = "";
  id: number = 0;
  isValid: boolean = false;
}
