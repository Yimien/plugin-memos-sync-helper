import {ITab} from "@/types/components/tab";
import {ICONS} from "@/configs/assets/icons";

export enum PanelKey {
    base,
    advanced,
    special,
    debug
}

export const panels : ITab[] =[
    {
        key: PanelKey.base,
        text: "基础配置",
        icon: `#iconSettings`
    },
    {
        key: PanelKey.advanced,
        text: "高级配置",
        icon: `#${ICONS.equalizer.name}`
    },
    {
        key: PanelKey.special,
        text: "专用配置",
        icon: `#iconPlugin`
    },
    {
        key: PanelKey.debug,
        text: "调试配置",
        icon: `#iconBug`
    }
]