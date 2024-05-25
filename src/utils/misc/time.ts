/**
 * 将不同时间的时间转换为上海时区的时间
 * @param timeString
 */
export function toChinaTime(timeString: string) {
    const dateTime = new Date(timeString);
    return dateTime.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai"
    });
}

/**
 * 时间比较
 * @param a
 * @param b
 */
export function timeIsLater(a: string, b: string) : boolean{
    const aTime = new Date(a);
    const bTime = new Date(b);

    return aTime >= bTime;
}

export function timeIsEarly (a: string, b: string) : boolean{
    const aTime = new Date(a);
    const bTime = new Date(b);

    return aTime < bTime;
}