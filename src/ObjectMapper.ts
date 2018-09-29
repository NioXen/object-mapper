import "reflect-metadata";
import { isPrimitiveOrPrimitiveClass, isArrayClass } from "./Utils";

const PROPERTY_DECORATOR_KEY = "MapProperty";

interface IDecoratorMetadata<T> {
  name?: string;
  _class?: { new (): T };
}

export default class ObjectMapper {
  public static mapObject<T>(type: { new (): T }, srcObj: object): T {
    if (typeof srcObj != "object") {
      return undefined;
    }
    const instance = new type();
    Object.keys(instance).forEach((key: string) => {
      const decoratorMetadata = this.getPropertyMetadata(instance, key);
      if (!decoratorMetadata) return;
      const decoratorName: string = decoratorMetadata.name
        ? decoratorMetadata.name
        : key;
      if (srcObj[decoratorName] == undefined) {
        instance[key] = null;
        return;
      }
      const decoratorType = this.getPropertyDesignType(instance, key);
      instance[key] = this.mapProperty(
        decoratorMetadata,
        decoratorName,
        decoratorType,
        srcObj
      );
    });
    return instance;
  }

  private static mapProperty<T>(
    decoratorMetadata: IDecoratorMetadata<any>,
    decoratorName: string,
    decoratorType: { new (): T },
    srcObj: object
  ): any {
    if (
      isPrimitiveOrPrimitiveClass(decoratorType) ||
      isPrimitiveOrPrimitiveClass(decoratorMetadata._class)
    ) {
      return srcObj[decoratorName];
    }
    if (!isArrayClass(decoratorType)) {
      return this.mapObject(decoratorType, srcObj[decoratorName]);
    } else if (
      decoratorMetadata._class &&
      isArrayClass(srcObj[decoratorName])
    ) {
      return srcObj[decoratorName].map(item =>
        this.mapObject(decoratorMetadata._class, item)
      );
    }
  }

  private static getPropertyMetadata<T>(
    target: any,
    propertyKey: string
  ): IDecoratorMetadata<T> {
    return Reflect.getMetadata(PROPERTY_DECORATOR_KEY, target, propertyKey);
  }
  private static getPropertyDesignType<T>(
    target: any,
    propertyKey: string
  ): { new (): T } {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }
}

export function MapProperty<T>(
  metadata?: IDecoratorMetadata<T> | string
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
