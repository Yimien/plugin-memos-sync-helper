import {SYNC_STATUS} from "@/configs";
import {ICONS} from "@/configs/assets/icons";
import {isMobile, topBarElement} from "@/index";
import {isEmptyValue} from "@/utils";

export class Sync {
    private static status;
    private static iconBefore;

    /**
     * 更新图标
     * @private
     */
    private static updateIcon() {
        let svg: any;

        if (Sync.status === SYNC_STATUS.waiting) {
            svg = ICONS.iconSync.svg;
        } else if (Sync.status === SYNC_STATUS.downloading) {
            svg = ICONS.iconDownload.svg;
        } else if (Sync.status === SYNC_STATUS.completed) {
            svg = ICONS.iconMemos.svg;
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
    private static recoveryIcon(){
        if (!isEmptyValue(Sync.iconBefore)){
            topBarElement.innerHTML = Sync.iconBefore;
        }
     }

    /**
     * 开始同步
     */
    static startSync(){
        Sync.status = SYNC_STATUS.downloading;
        Sync.backupIcon();
        Sync.updateIcon();
    }

    /**
     * 同步出错
     */
    static syncError() {
        Sync.status = SYNC_STATUS.completed;
        Sync.recoveryIcon();
    }

    /**
     * 同步成功
     */
    static syncSuccess() {
        Sync.status = SYNC_STATUS.completed;
        Sync.updateIcon();
    }

    /**
     * 可以同步
     */
    static canSync(){
        Sync.status = SYNC_STATUS.waiting;
        Sync.updateIcon();
    }

    /**
     * 是否在同步数据？
     */
    static isSyncing(){
        return Sync.status === SYNC_STATUS.downloading;
    }
}