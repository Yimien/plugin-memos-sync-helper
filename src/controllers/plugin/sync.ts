import {sync_status} from "@/constants";
import {ICONS} from "@/constants/assets/icons";
import {isMobile, topBarElement} from "@/index";
import {isEmptyValue} from "@/utils";

export class Sync {
    private static status: string | number;
    private static iconBefore: string;

    /**
     * 开始同步
     */
    static startSync() {
        Sync.status = sync_status.downloading;
        Sync.backupIcon();
        Sync.updateIcon();
    }

    /**
     * 同步出错
     */
    static syncError() {
        Sync.status = sync_status.completed;
        Sync.recoveryIcon();
    }

    /**
     * 同步成功
     */
    static syncSuccess() {
        Sync.status = sync_status.completed;
        Sync.updateIcon();

        // todo 修改上次同步时间
    }

    /**
     * 可以同步
     */
    static canSync() {
        Sync.status = sync_status.waiting;
        Sync.updateIcon();
    }

    /**
     * 是否在同步数据？
     */
    static isSyncing() {
        return Sync.status === sync_status.downloading;
    }

    /**
     * 更新图标
     * @private
     */
    private static updateIcon() {
        let svg: any;

        if (Sync.status === sync_status.waiting) {
            svg = ICONS.sync.svg;
        } else if (Sync.status === sync_status.downloading) {
            svg = ICONS.download.svg;
        } else if (Sync.status === sync_status.completed) {
            svg = ICONS.memos.svg;
        }

        if (isMobile) {
            svg += '<span class="b3-menu__label">Memos 同步助手</span>'
        }

        topBarElement.innerHTML = svg;
    }

    /**
     * 备份图标
     * @private
     */
    private static backupIcon() {
        Sync.iconBefore = topBarElement.innerHTML;
    }

    /**
     * 恢复图标
     * @private
     */
    private static recoveryIcon() {
        if (!isEmptyValue(Sync.iconBefore)) {
            topBarElement.innerHTML = Sync.iconBefore;
        }
    }
}