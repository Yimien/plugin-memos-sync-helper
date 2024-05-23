import {
    iconPodcast,
    iconSpinner,
    iconMemos,
} from "@/assets/icons";

export const ICONS = {
    /**
     * 未检查到可同步数据或者同步完成
     */
    iconMemos: {
        name: "iconMemos",
        icon: iconMemos
    },
    /**
     * 检查到可同步数据
     */
    iconWaiting: {
        name: "iconPodcast",
        icon: iconPodcast
    },
    /**
     * 同步中
     */
    iconSyncing: {
        name: "iconSpinner",
        icon: iconSpinner
    }
}