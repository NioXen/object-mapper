import ObjectMapper from "../src/ObjectMapper";
import * as testClasses from "./TestClasses.spec";
import "mocha";
import { should } from "chai";
import testObjects from "./TestSourceJson.json";
should();

describe("JsonMapper", () => {
  // const testObjects.simpleObject = {
  //   name: "one",
  //   id: 1,
  //   isValid: true
  // };
  // const incompletetestObjects.SimpleObject = {
  //   name: "one",
  //   isValid: true
  // };
  // const testObjects.complexObject = {
  //   class1: {
  //     name: "one",
  //     id: 1,
  //     isValid: true
  //   }
  // };
  // const extratestObjects.ComplexObject = {
  //   class1: {
  //     name: "one",
  //     id: 1,
  //     isValid: true,
  //     isNotValid: false
  //   }
  // };
  // const testObjects.arrayObject = {
  //   array1: ["hello", "world"]
  // };
  // const classtestObjects.ArrayObject = {
  //   classArray1: [
  //     {
  //       name: "one",
  //       id: 1,
  //       isValid: true
  //     },
  //     {
  //       name: "two",
  //       id: 2,
  //       isValid: false
  //     }
  //   ]
  // };
  it("should return an instantiated class of type T", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.simpleObject
    );
    mappedObj.should.be.an.instanceof(testClasses.BasicPrimitives);
  });
  it("should map decorated primitive properties by key", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.simpleObject
    );
    mappedObj.should.deep.equal(testObjects.simpleObject);
  });
  it("should map decorated primitive properties by decorated name if provided", () => {
    const mappedObj = ObjectMapper.mapObject(
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
    const mappedObj = ObjectMapper.mapObject(
      testClasses.BasicObject,
      testObjects.complexObject
    );
    mappedObj.should.deep.equal(testObjects.complexObject);
  });
  it("should map decorated object properties by decorated name if provided", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.NamedObject,
      testObjects.complexObject
    );
    mappedObj.should.have
      .property("clas1")
      .which.deep.equals(testObjects.complexObject.class1);
  });
  it("should map decorated arrays of primitive type by key when a decorator _class is provided", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.PrimitivesArray,
      testObjects.arrayObject
    );
    mappedObj.should.deep.equal(testObjects.arrayObject);
  });
  it("should map decorated arrays of primitive type by name when a decorator _class & name are provided", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.NamedPrimitivesArray,
      testObjects.arrayObject
    );
    mappedObj.should.have
      .property("aarray1")
      .which.deep.equals(testObjects.arrayObject.array1);
  });
  it("should map decorated arrays of objects by key when a decorator _class is provided", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.ObjectsArray,
      testObjects.classArrayObject
    );
    mappedObj.should.deep.equal(testObjects.classArrayObject);
  });
  it("should map decorated arrays of objects by name when a decorator _class & name are provided", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.NamedObjectsArray,
      testObjects.classArrayObject
    );
    mappedObj.should.have
      .property("oobjArray1")
      .with.deep.members(testObjects.classArrayObject.objArray1);
  });
  it("should map decorated properties which do not exist on the source as null", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.BasicPrimitives,
      testObjects.incompleteSimpleObject
    );
    mappedObj.should.have.property("id").which.equals(null);
  });
  it("should map decorated properties as null when an empty source object is provided", () => {
    const mappedObj = ObjectMapper.mapObject(testClasses.BasicPrimitives, {});
    mappedObj.should.have.property("name").that.is.null;
    mappedObj.should.have.property("id").that.is.null;
    mappedObj.should.have.property("isValid").that.is.null;
  });
  it("should not map un-decorated properties", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.UnDecoratedPrimitives,
      testObjects.simpleObject
    );
    const freshObj = new testClasses.UnDecoratedPrimitives();
    mappedObj.should.deep.equal(freshObj);
  });
  it("should ignore source object properties which are not declared on the decorated class", () => {
    const mappedObj = ObjectMapper.mapObject(
      testClasses.BasicObject,
      testObjects.extraComplexObject
    );
    mappedObj.class1.should.not.have.property("isNotValid");
    mappedObj.should.deep.equal(testObjects.complexObject);
  });
});
