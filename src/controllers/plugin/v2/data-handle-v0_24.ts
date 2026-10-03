import {IRelationV0_24_0} from "@/types/memos/v2";
import {DataHandleV2} from "@/controllers/plugin/v2/data-handle";
import {IResGetMemos} from "@/types/memos";
import {IResDataHandleRunV2} from "@/types/plugin/v2/handle";
import {debugMessage} from "@/utils";
import {pluginConfigData} from "@/index";


export class DataHandleV0_24 extends DataHandleV2{

    protected handleRelations(memo): void {
        let relations : IRelationV0_24_0[] = memo.relations || [];

        for (let relation of relations) {
            if (!relation) continue;
            const memoName = typeof relation.memo === 'string' ? relation.memo : relation.memo?.name;
            const relatedMemoName = typeof relation.relatedMemo === 'string' ? relation.relatedMemo : relation.relatedMemo?.name;

            let exists = this.relations.some(r => {
                if (!r) return false;
                const rMemoName = typeof r.memo === 'string' ? r.memo : r.memo?.name;
                const rRelatedMemoName = typeof r.relatedMemo === 'string' ? r.relatedMemo : r.relatedMemo?.name;
                return memoName === rMemoName && relatedMemoName === rRelatedMemoName;
            });

            if (!exists) {
                this.relations.push(relation);
            }
        }
    }

    static async run(data: IResGetMemos) : Promise<IResDataHandleRunV2> {
        let dh = new DataHandleV0_24();

        await dh.handleMemos(data.new);

        let result: IResDataHandleRunV2 = {
            resources: dh.resources,
            relations: dh.relations,
            oldMemos: data.old,
            newMemos: dh.newMemos
        }

        debugMessage(pluginConfigData.debug.isDebug, "数据处理结果", result);

        return result;
    }
}