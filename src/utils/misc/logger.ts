/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {UA} from "@/utils/misc/user-agent";

/**
 * 日志记录器
 * REF: [Console - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/console)
 */
export class Logger {
    protected readonly FLAG_FIREFOX: boolean;

    constructor(
        public label: string, // 日志标签名称
        public collapsed: boolean = true, // 是否折叠日志组
    ) {
        this.FLAG_FIREFOX = UA.browser.name === "Firefox" || UA.engine.name === "Gecko";
    }

    clear(...args: any[]) {
        this.stdout(globalThis.console.clear, false, ...args);
    }

    countReset(...args: any[]) {
        this.stdout(globalThis.console.countReset, false, ...args);
    }

    count(...args: any[]) {
        this.stdout(globalThis.console.count, false, ...args);
    }

    counts(...args: any[]) {
        this.stdout(globalThis.console.count, true, ...args);
    }

    assert(...args: any[]) {
        this.stdout(globalThis.console.assert, false, ...args);
    }

    asserts(...args: any[]) {
        this.stdout(globalThis.console.assert, true, ...args);
    }

    dir(...args: any[]) {
        this.stdout(globalThis.console.dir, false, ...args);
    }

    dirs(...args: any[]) {
        this.stdout(globalThis.console.dir, true, ...args);
    }

    dirxml(...args: any[]) {
        this.stdout(globalThis.console.dirxml, false, ...args);
    }

    dirxmls(...args: any[]) {
        this.stdout(globalThis.console.dirxml, true, ...args);
    }

    table(...args: any[]) {
        this.stdout(globalThis.console.table, false, ...args);
    }

    tables(...args: any[]) {
        this.stdout(globalThis.console.table, true, ...args);
    }

    debug(...args: any[]) {
        this.stdout(globalThis.console.debug, false, ...args);
    }

    debugs(...args: any[]) {
        this.stdout(globalThis.console.debug, true, ...args);
    }

    info(...args: any[]) {
        this.stdout(globalThis.console.info, false, ...args);
    }

    infos(...args: any[]) {
        this.stdout(globalThis.console.info, true, ...args);
    }

    log(...args: any[]) {
        this.stdout(globalThis.console.log, false, ...args);
    }

    logs(...args: any[]) {
        this.stdout(globalThis.console.log, true, ...args);
    }

    warn(...args: any[]) {
        this.stdout(globalThis.console.warn, false, ...args);
    }

    warns(...args: any[]) {
        this.stdout(globalThis.console.warn, true, ...args);
    }

    error(...args: any[]) {
        this.stdout(globalThis.console.error, false, ...args);
    }

    errors(...args: any[]) {
        this.stdout(globalThis.console.error, true, ...args);
    }

    /**
     * 输出
     * @param func - 所使用的输出函数
     * @param multiple - 是否进行多次输出
     * @param args - 输出函数的参数
     */
    protected stdout(
        func: (message?: any, ...optionalParams: any[]) => void,
        multiple: boolean,
        ...args: any[]
    ): void {
        const label = this.FLAG_FIREFOX
            ? `[${this.label}] - <${func.name.toUpperCase()}>`
            : `[\x1b[4m${this.label}\x1b[0m] - <\x1b[1m${func.name.toUpperCase()}\x1b[0m>`; // 日志组标签

        if (this.collapsed) {
            globalThis.console.groupCollapsed(label); // 启用折叠日志组
        } else {
            globalThis.console.group(label); // 启用不折叠日志组
        }

        if (multiple) {
            for (const arg of args) {
                Array.isArray(arg) ? func(...arg) : func(arg); // 输出多日志
            }
        } else {
            func(...args); // 输出日志
        }

        globalThis.console.trace(); // 输出调用堆栈
        globalThis.console.groupEnd(); // 结束日志组
    }
}
