import Mapper from "../src/Mapper";
import * as testClasses from "./TestClasses";
import "mocha";
import { should } from "chai";
import testObjects from "./TestSourceJson.json";
should();

describe("JsonMapper", () => {
  it("should return an instantiated class of type T", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.simpleObject
    );
    mappedObj.should.be.an.instanceof(testClasses.BasicPrimitives);
  });
  it("should map decorated primitive properties by key", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.simpleObject
    );
    mappedObj.should.deep.equal(testObjects.simpleObject);
  });
  it("should map decorated primitive properties by decorated name if provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.NamedPrimitives,
      testObjects.simpleObject
    );
    mappedObj.should.include({
      iid: testObjects.simpleObject.id,
      nname: testObjects.simpleObject.name,
      iisValid: testObjects.simpleObject.isValid
    });
  });
  it("should map decorated object properties by design:type", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.BasicObject,
      testObjects.complexObject
    );
    mappedObj.should.deep.equal(testObjects.complexObject);
  });
  it("should map decorated object properties by decorated name if provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.NamedObject,
      testObjects.complexObject
    );
    mappedObj.should.have
      .property("clas1")
      .which.deep.equals(testObjects.complexObject.class1);
  });
  it("should map decorated arrays of primitive type by key when a decorator _class is provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.PrimitivesArray,
      testObjects.arrayObject
    );
    mappedObj.should.deep.equal(testObjects.arrayObject);
  });
  it("should map decorated arrays of primitive type by name when a decorator _class & name are provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.NamedPrimitivesArray,
      testObjects.arrayObject
    );
    mappedObj.should.have
      .property("aarray1")
      .which.deep.equals(testObjects.arrayObject.array1);
  });
  it("should map decorated arrays of objects by key when a decorator _class is provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.ObjectsArray,
      testObjects.classArrayObject
    );
    mappedObj.should.deep.equal(testObjects.classArrayObject);
  });
  it("should map decorated arrays of objects by name when a decorator _class & name are provided", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.NamedObjectsArray,
      testObjects.classArrayObject
    );
    mappedObj.should.have
      .property("oobjArray1")
      .with.deep.members(testObjects.classArrayObject.objArray1);
  });
  it("should map decorated properties which do not exist on the source as null", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.incompleteSimpleObject
    );
    mappedObj.should.have.property("id").which.equals(null);
  });
  it("should map decorated properties as null when an empty source object is provided", () => {
    const mappedObj = Mapper.mapObject(testClasses.BasicPrimitives, {});
    mappedObj.should.have.property("name").that.is.null;
    mappedObj.should.have.property("id").that.is.null;
    mappedObj.should.have.property("isValid").that.is.null;
  });
  it("should ignore un-decorated properties", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.UnDecoratedPrimitives,
      testObjects.simpleObject
    );
    const freshObj = new testClasses.UnDecoratedPrimitives();
    mappedObj.should.deep.equal(freshObj);
  });
  it("should ignore source object properties which are not declared on the decorated class", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.BasicObject,
      testObjects.extraComplexObject
    );
    mappedObj.class1.should.not.have.property("isNotValid");
    mappedObj.should.deep.equal(testObjects.complexObject);
  });
  it("should map array elements as null when the types are incompatible", () => {
    const mappedObj = Mapper.mapObject(
      testClasses.PrimitivesArray,
      testObjects.numberArrayObject
    );
    mappedObj.array1.should.deep.equal([null, null, null]);
  });
  it("should throw an error when an array is decorated with no _class", () => {
    (function() {
      const mappedObj = Mapper.mapObject(
        testClasses.InvalidPrimitivesArray,
        testObjects.arrayObject
      );
    }.should.throw(Error));
  });
});
