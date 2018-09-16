export function isPrimitiveOrPrimitiveClass(obj:any):boolean {
    return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || 
    (obj === String || obj === Number || obj === Boolean));
}

export function isArrayClass(_class: Function):boolean {
    if (_class === Array) {
        return true;
    }
    return Object.prototype.toString.call(_class) === "[object Array]";
}