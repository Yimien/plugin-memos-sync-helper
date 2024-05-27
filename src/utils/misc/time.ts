import moment from "moment";

/**
 * 将不同时间的时间转换为上海时区的时间
 * @param timeString
 */
export function toChinaTime(timeString: string) {
    return moment(timeString).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss');
}

export function formatTime(timeString: string) {
    return moment(timeString).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * a 早于 b
 * @param a
 * @param b
 */
export function timeIsBefore(a: string, b: string): boolean {
    return moment(a).isBefore(b);
}

/**
 * a == b
 * @param a
 * @param b
 */
export function timeIsSame(a: string, b: string): boolean {
    return moment(a).isSame(b);
}

/**
 * a 晚于 b
 * @param a
 * @param b
 */
export function timeIsAfter(a: string, b: string): boolean {
    return moment(a).isAfter(b);
}

/**
 * a 早于 b || a == b
 * @param a
 * @param b
 */
export function timeIsSameOrBefore(a: string, b: string): boolean {
    return moment(a).isSameOrBefore(b);
}

/**
 * a 晚于 b || a == b
 * @param a
 * @param b
 */
export function timeIsSameOrAfter(a: string, b: string) {
    return moment(a).isSameOrAfter(b);
}

/**
 * 休眠
 * @param ms - 时间单位
 * @constructor
 */
export const sleep = (ms)=> {
    return new Promise(resolve=>setTimeout(resolve, ms))
}