import {ITab} from "@/types/components/tab";
import {ICONS} from "@/constants/assets/icons";

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
        icon: `#${ICONS.equalizer.name}`
    },
    {
        key: panelKey.special,
        text: "专用配置",
        icon: `#iconPlugin`
    },
    {
        key: panelKey.debug,
        text: "调试配置",
        icon: `#iconBug`
    }
]