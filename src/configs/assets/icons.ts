import {iconDownload, iconSync, iconMemos, iconEqualizer, iconConfig, iconDebug} from "@/assets/icons";
import {svgMemos, svgDownload, svgSync, svgEqualizer, svgConfig, svgDebug} from "@/assets/svg";

export const ICONS = {
    /**
     * 未检查到可同步数据或者同步完成
     */
    memos: {
        name: "iconMemos",
        icon: iconMemos,
        svg: svgMemos
    },
    /**
     * 检查到可同步数据
     */
    sync: {
        name: "iconSync",
        icon: iconSync,
        svg: svgSync
    },
    /**
     * 同步下载中
     */
    download: {
        name: "iconDownload",
        icon: iconDownload,
        svg: svgDownload
    },
    /**
     * 设置
     */
    equalizer: {
        name: "iconEqualizer",
        icon: iconEqualizer,
        svg: svgEqualizer
    },
    config: {
        name: "iconConfig",
        icon: iconConfig,
        svg: svgConfig
    },
    debug: {
        name: "iconDebug",
        icon: iconDebug,
        svg: svgDebug
    },
}