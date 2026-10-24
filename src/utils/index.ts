/**
 * 判断值是否为空
 * @param value - 需要判断的变量
 */
export function isEmptyValue(value: any) {
    return value === null || value === undefined || value === '';
}

/**
 * 判断两个列表是否存在相同的元素
 * @param list1
 * @param list2
 */
export function hasCommonElements<T>(list1: T[], list2: T[]): boolean {
    const set1 = new Set(list1);
    for (const item of list2) {
        if (set1.has(item)) {
            return true;
        }
    }
    return false;
}

/**
 * 调试日志缓冲（debug 模式下记录，供导出到文件）
 */
export const debugLogBuffer: string[] = [];

function stringifyLogData(data: any): string {
    if (typeof data === 'string') {
        return data;
    }
    try {
        return JSON.stringify(data);
    } catch {
        return String(data);
    }
}

/**
 * 在控制台输出调试信息
 * @param isShow - 是否输出
 * @param message - 输出信息
 * @param data - 输出数据
 * @param isTitle - 是否是标题
 */
export function debugMessage(isShow: boolean, message: any, data?: any, isTitle: boolean = false) {
    if (isShow) {
        if (isTitle) {
            console.log(`【${message}】`);
            debugLogBuffer.push(`【${message}】`);
        } else {
            if (isEmptyValue(data)) {
                console.log(`${message}`);
                debugLogBuffer.push(`${message}`);
            } else {
                console.log(`${message}：`);
                console.log(data);
                const text = stringifyLogData(data);
                debugLogBuffer.push(`${message}：${text.length > 2000 ? text.slice(0, 2000) + '...(truncated)' : text}`);
            }
        }
        if (debugLogBuffer.length > 600) {
            debugLogBuffer.shift();
        }
    }
}
