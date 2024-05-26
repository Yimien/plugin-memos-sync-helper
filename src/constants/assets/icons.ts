import {SYMBOL_DOWNLOAD, SYMBOL_EQUALIZER, SYMBOL_MEMOS, SYMBOL_SYNC} from "@/assets/symbol";
import {SVG_DOWNLOAD, SVG_EQUALIZER, SVG_MEMOS, SVG_SYNC} from "@/assets/svg";

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
    sync: {
        name: "iconSync",
        icon: SYMBOL_SYNC,
        svg: SVG_SYNC
    },
    /**
     * 同步下载中
     */
    download: {
        name: "iconDownload",
        icon: SYMBOL_DOWNLOAD,
        svg: SVG_DOWNLOAD
    },
    /**
     * 高级设置
     */
    equalizer: {
        name: "iconEqualizer",
        icon: SYMBOL_EQUALIZER,
        svg: SVG_EQUALIZER
    }
}