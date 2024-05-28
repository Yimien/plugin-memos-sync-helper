import {ITab} from "@/types/components/tab";


export enum panelKey {
    base,
    advanced,
    special,
    debug
}

export const PANELS: ITab[] = [
    {
        key: panelKey.base,
        text: "基础配置",
        icon: `#iconSettings`
    },
    {
        key: panelKey.advanced,
        text: "高级配置",
        icon: `#iconPlugin`
    },
    {
        key: panelKey.special,
        text: "过滤配置",
        icon: `#iconFilter`
    },
    {
        key: panelKey.debug,
        text: "调试配置",
        icon: `#iconBug`
    }
]