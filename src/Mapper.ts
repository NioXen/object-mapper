import "reflect-metadata";
import { isPrimitiveOrPrimitiveClass, isArrayClass, primitiveTypeCheck, hasAnyNullOrUndefined } from "./Utils";

const PROPERTY_DECORATOR_KEY = "MapProperty";

interface IDecoratorMetadata<T> {
  name?: string;
  _class?: { new (): T };
}

interface IGenericObject {
  [key: string]: any;
}

export default class Mapper {
  public static mapObject<T>(type: { new (): T }, srcObj: IGenericObject): T {
    if (hasAnyNullOrUndefined(type, srcObj)) return null;
    const instance = new type();
    Object.keys(instance).forEach((key: string) => {
      const decoratorMetadata = this.getPropertyMetadata(instance, key);
      if (!decoratorMetadata) return;
      const decoratorName: string = decoratorMetadata.name ? decoratorMetadata.name : key;
      if (srcObj[decoratorName] == undefined) {
        instance[key] = null;
        return;
      }
      const decoratorType = this.getPropertyDesignType(instance, key);
      instance[key] = this.mapProperty(decoratorMetadata, decoratorType, srcObj[decoratorName]);
    });
    return instance;
  }

  private static mapProperty<T>(
    decoratorMetadata: IDecoratorMetadata<any>,
    decoratorType: { new (): T },
    srcProperty: any,
  ): any {
    const isPrimitive =
      isPrimitiveOrPrimitiveClass(decoratorType) || isPrimitiveOrPrimitiveClass(decoratorMetadata._class);

    if (isArrayClass(decoratorType)) {
      if (!decoratorMetadata._class) throw new Error("An array is declared but no _class is present in the metadata");
      if (!isArrayClass(srcProperty)) return;
      if (isPrimitive) {
        return srcProperty.map(item => {
          if (primitiveTypeCheck(decoratorMetadata._class, item)) return item;
          else return null;
        });
      } else {
        return srcProperty.map(item => {
          return this.mapObject(decoratorMetadata._class, item);
        });
      }
    } else {
      if (isPrimitive) {
        if (primitiveTypeCheck(decoratorType, srcProperty)) return srcProperty;
        else return null;
      } else {
        return this.mapObject(decoratorType, srcProperty);
      }
    }
  }
  private static getPropertyMetadata<T>(target: any, propertyKey: string): IDecoratorMetadata<T> {
    return Reflect.getMetadata(PROPERTY_DECORATOR_KEY, target, propertyKey);
  }
  private static getPropertyDesignType<T>(target: any, propertyKey: string): { new (): T } {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }
}

export function MapProperty<T>(
  metadata?: IDecoratorMetadata<T> | string,
): (target: Object, targetKey: string | symbol) => void {
  let decoratorMetadata: IDecoratorMetadata<T>;
  if (typeof metadata === "string" || metadata instanceof String) {
    decoratorMetadata = <IDecoratorMetadata<T>>{ name: metadata };
  } else if (typeof metadata === "object") {
    decoratorMetadata = metadata as IDecoratorMetadata<T>;
  } else {
    /*As long as a property is decorated, design:type will be captured*/
    decoratorMetadata = <IDecoratorMetadata<T>>{};
  }
  return Reflect.metadata(PROPERTY_DECORATOR_KEY, decoratorMetadata);
}
