/**
 * 判断值是否为空
 * @param value - 需要判断的变量
 */
export async function isEmptyValue(value: any) {
    return value === null || value === undefined || value === '';
}