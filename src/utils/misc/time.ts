import moment from "moment";
import {pluginConfigData} from "@/index";


/**
 * 将不同时间的时间转换为上海时区的时间
 * @param timeString
 */
export function toChinaTime(timeString: string) {
    return moment(timeString).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateTime(timeString: string | number) {
    const timestamp = typeof timeString === 'number' ? timeString * 1000 : timeString;
    // return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    return moment(timestamp).format(pluginConfigData.advanced.formatDataTime);
}

export function formatDate(timeString: string | number) {
    const timestamp = typeof timeString === 'number' ? timeString * 1000 : timeString;
    return moment(timestamp).format('YYYY-MM-DD');
}

/**
 * 休眠
 * @param ms - 时间单位
 * @constructor
 */
export const sleep = (ms: number)=> {
    return new Promise(resolve=>setTimeout(resolve, ms))
}