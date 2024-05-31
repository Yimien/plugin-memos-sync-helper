import {DataSave} from "@/controllers/plugin/v2/data-save/index";
import {IResDataHandleRun, IResHandleMemo} from "@/types/memos/v2/handle";
import {deleteMode} from "@/constants/plugin";
import {debugMessage} from "@/utils";
import {pluginConfigData} from "@/index";

export class DailyNotes extends DataSave {
    constructor(data:　IResDataHandleRun) {
        super(data);
        this.nowDeleteMode = deleteMode.blockId;
    }

    async save(newMemo: IResHandleMemo) {
        debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);


    }

    static async runSync(data: IResDataHandleRun) {
        let dn = new DailyNotes(data);
        await dn.main();
    }
}