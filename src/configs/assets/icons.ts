import {iconDownload, iconSync, iconMemos} from "@/assets/icons";
import {svgMemos, svgDownload, svgSync} from "@/assets/svg";

export const ICONS = {
    /**
     * 未检查到可同步数据或者同步完成
     */
    iconMemos: {
        name: "iconMemos",
        icon: iconMemos,
        svg: svgMemos
    },
    /**
     * 检查到可同步数据
     */
    iconSync: {
        name: "iconPodcast",
        icon: iconSync,
        svg: svgSync
    },
    /**
     * 同步下载中
     */
    iconDownload: {
        name: "iconSpinner",
        icon: iconDownload,
        svg: svgDownload
    }
}