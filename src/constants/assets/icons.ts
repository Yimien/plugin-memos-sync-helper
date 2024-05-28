import {SYMBOL_DOWNLOAD, SYMBOL_MEMOS, SYMBOL_SYNCING} from "@/assets/symbol";
import {SVG_DOWNLOAD, SVG_MEMOS, SVG_SYNCING} from "@/assets/svg";

export const ICONS = {
    /**
     * 未检查到可同步数据或者同步完成
     */
    memos: {
        name: "iconMemos",
        icon: SYMBOL_MEMOS,
        svg: SVG_MEMOS
    },
    /**
     * 检查到可同步数据
     */
    syncing: {
        name: "iconSyncing",
        icon: SYMBOL_SYNCING,
        svg: SVG_SYNCING
    },
    /**
     * 同步下载中
     */
    download: {
        name: "iconDownload",
        icon: SYMBOL_DOWNLOAD,
        svg: SVG_DOWNLOAD
    }
}