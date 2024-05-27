import {isEmptyValue} from "@/utils";

/**
 * 分割字符串，移除空元素，返回列表
 * @param str - 字符串
 * @param separator - 切分条件
 */
export function stringSplit(str: string, separator: string): string[] {
    return str.split(separator).filter(item => !isEmptyValue(item.trim()));
}