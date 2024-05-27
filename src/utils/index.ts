/**
 * 判断值是否为空
 * @param value - 需要判断的变量
 */
export function isEmptyValue(value: any) {
    return value === null || value === undefined || value === '';
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
        } else {
            if (isEmptyValue(data)) {
                console.log(`${message}`);
            } else {
                console.log(`${message}：`);
                console.log(data);
            }
        }
    }
}
