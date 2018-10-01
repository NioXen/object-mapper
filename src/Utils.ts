export function isPrimitiveOrPrimitiveClass(obj: any): boolean {
  return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 ||
  (obj === String || obj === Number || obj === Boolean));
}

export function hasAnyNullOrUndefined(...args: any[]) {
  return args.some((arg: any) => arg === null || arg === undefined);
}

export function primitiveTypeCheck<T>(
  type: {new (): T},
  item: string | boolean | number
): boolean {
  /**TODO
   * Find a way to compare [Function: String] to the primitive string and it be equal (and vice versa)
   * without having to instantiate one every time
   */
  const t = new type();
  const typeToString = Object.prototype.toString.call(t).toUpperCase();
  const itemType = (typeof item).toUpperCase();
  if (typeToString.includes(itemType)) {
    return true;
  }
  return false;
}

export function isArrayClass(_class: Function): boolean {
  if (_class === Array) {
    return true;
  }
  return Object.prototype.toString.call(_class) === "[object Array]";
}
