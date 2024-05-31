import {pluginConfigData} from "@/index";
import {IResHandleDataV2} from "@/types/memos/v2/handle";
import {deleteMode} from "@/constants/plugin";
import {DataSave} from "@/controllers/plugin/v2/data-save/index";
import {DataHandle} from "@/controllers/plugin/v2/data-handle";
import {memosSortKey} from "@/constants/components/select";


export class SingleDoc extends DataSave{

    constructor(data: IResHandleDataV2) {
        super(data);
        this.nowDeleteMode = deleteMode.path;
    }


    protected async batchSave(): Promise<void>  {
        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            DataHandle.sortMemos(this.data.newMemos, true);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            DataHandle.sortMemos(this.data.newMemos, false);
        }

        for (let newMemo of this.data.newMemos) {
            await this.saveSingleDocument(newMemo);
        }
    }

    public static async runSync(data: IResHandleDataV2) {
        let sd = new SingleDoc(data);
        await sd.main();
    }
}
