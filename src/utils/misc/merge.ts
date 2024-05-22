import deepmerge from "deepmerge";

export function merge<T>(...args: Partial<T>[]): T {
    return deepmerge.all<T>(args);
}

export function mergeIgnoreArray<T>(...args: Partial<T>[]): T {
    return deepmerge.all<T>(args, { arrayMerge: (_target, source, _options) => source });
}