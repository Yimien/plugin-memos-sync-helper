import {isEmptyValue} from "@/utils";

/**
 * 分割字符串，移除空元素，返回列表
 * @param str - 字符串
 * @param separator - 切分条件
 * @param isFilter - 是否过滤空元素
 */
export function stringSplit(str: string, separator: string, isFilter: boolean = true): string[] {
    if (isFilter) {
        return str.split(separator).filter(item => !isEmptyValue(item.trim()));
    } else {
        return str.split(separator);
    }
}
