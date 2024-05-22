import {ITab} from "@/types/components/tab";

export enum PanelKey {
    general,
    advanced,
    old,
    debug
}

export const panels : ITab[] =[
    {
        key: PanelKey.general,
        text: "常规配置",
        icon: "#iconSettings"
    },
    {
        key: PanelKey.advanced,
        text: "高级配置",
        icon: "#iconPlugin"
    },
    {
        key: PanelKey.old,
        text: "旧版配置",
        icon: "#iconHistory"
    },
    {
        key: PanelKey.debug,
        text: "调试配置",
        icon: "#iconBug"
    }
]