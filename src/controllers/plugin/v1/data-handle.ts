import {debugMessage} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import {formatDateTime} from "@/utils/misc/time";
import {MEMOS_ASSETS} from "@/constants";
import {IContents} from "@/types/plugin";
import {IMemoV1, IResourceV1} from "@/types/memos/v1";
import {IResDataHandleRunV1} from "@/types/plugin/v1/handle";
import {DataHandleBase} from "@/controllers/plugin/common/handle/DataHandleBase";


/**
 * 数据处理
 */
export class DataHandleV1 extends DataHandleBase{

    protected getMemoId(memo: IMemoV1): string {
        return memo.id.toString();
    }

    protected getMemoUid(memo: IMemoV1): string {
        return memo.name;
    }

    protected getUpdateTime(memo: IMemoV1): string {
        return formatDateTime(memo.updatedTs);
    }

    protected handleRelations(memo: IMemoV1): void {
        let relations = memo.relationList;
        for (let relation of relations) {
            const exists = this.relations.some(r =>
                relation.memoId === r.memoId && relation.relatedMemoId === r.relatedMemoId
            );
            if (!exists) {
                this.relations.push(relation);
            }
        }
    }

    protected handleResources(memo: IMemoV1, contents: IContents): void {
        let resources = memo.resourceList;
        this.getResourceContents(contents, resources);
        this.resources = this.resources.concat(resources);
    }

    protected getResourcePath(resource: IResourceV1) {
        let filename = resource.filename;
        let resourceId = resource.id.toString();
        let timestamp = resource.updatedTs;
        let end = filename.split('.').pop();
        return `${MEMOS_ASSETS}/${resourceId}_${timestamp}.${end}`;
    }


    // **************************************** export ****************************************


    /**
     * 获取路径
     * @param resource
     */
    static getResourcePathString(resource: IResourceV1) {
        let db = new DataHandleV1();
        return db.getResourcePath(resource);
    }


    static async run(data: IResGetMemos) : Promise<IResDataHandleRunV1> {
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        let dh = new DataHandleV1();

        await dh.handleMemos(data.new);

        let result: IResDataHandleRunV1 = {
            resources: dh.resources,
            relations: dh.relations,
            oldMemos: data.old,
            newMemos: dh.newMemos
        }

        debugMessage(pluginConfigData.debug.isDebug, "数据处理结果", result);
        return result;
    }
}