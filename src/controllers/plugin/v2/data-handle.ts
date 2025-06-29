import {debugMessage} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import {IMemoV0_24_0, IMemoV2, IResourceV2} from "@/types/memos/v2";
import {formatDateTime, toChinaTime} from "@/utils/misc/time";
import {INewMemoV2, IResDataHandleRunV2} from "@/types/plugin/v2/handle";
import moment from "moment/moment";
import {IContent, IContents, INewMemo} from "@/types/plugin";
import {DataHandleBase} from "@/controllers/plugin/common/handle/DataHandleBase";
import {INewMemoV1} from "@/types/plugin/v1/handle";
import {API_VERSION} from "@/constants/memos";


export class DataHandleV2 extends DataHandleBase{

    async handelMemoV0240(memo: any) {
        debugMessage(pluginConfigData.debug.isDebug, "开始处理 Memos", memo);

        let memoId: string = this.getMemoId(memo);
        let memoUid: string = memoId;
        let updateTime: string = this.getUpdateTime(memo);
        let title: string;
        if (pluginConfigData.advanced.showCreateTime) {
            let createTime: string = this.getCreateTime(memo);
            // title = `${updateTime}・${createTime}`;
            title = `${updateTime} <${createTime}>`;
        } else {
            title = `${updateTime}`;
        }

        let contents: IContent[] = await this.getContents(memo);

        this.handleResources(memo, contents);
        this.handleRelations(memo);

        let result: INewMemo = {
            id: memoId,
            uid: memoUid,
            title: title,
            updateTime: updateTime,
            contents: contents,
            memo: memo
        };

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", result);

        return result;
    }

    protected async handelMemo(memo: any): Promise<INewMemoV1 | INewMemoV2> {
        if (API_VERSION.V2_Y2025_M02_D05.includes(pluginConfigData.base.version)) {
            return this.handelMemoV0240(memo);
        } else {
            return super.handelMemo(memo);
        }
    }

    protected getMemoId(memo: IMemoV2) {
        return memo.name.split('/').pop();
    }

    protected getMemoUid(memo: IMemoV2): string {
        return memo.uid;
    }

    protected getCreateTime(memo: IMemoV2): string {
        return formatDateTime(toChinaTime(memo.createTime));
    }

    protected getUpdateTime(memo: IMemoV2): string {
        return formatDateTime(toChinaTime(memo.updateTime));
    }

    protected handleRelations(memo: IMemoV2 | IMemoV0_24_0): void {
        let relations = memo.relations;
        for (let relation of relations) {
            let exists: boolean;

            exists = this.relations.some(r =>
                relation.memo === r.memo && relation.relatedMemo === r.relatedMemo
            );

            if (!exists) {
                this.relations.push(relation);
            }
        }
    }

    protected handleResources(memo: IMemoV2, contents: IContents): void {
        let resources = memo.resources;
        this.getResourceContents(contents, resources);
        this.resources = this.resources.concat(resources);
    }

    protected getResourcePath(resource: IResourceV2): string {
        let filename = resource.filename;
        let resourceId = resource.name.split('/').pop();
        let timestamp = moment(toChinaTime(resource.createTime)).unix();
        let end = filename.split('.').pop();
        return `${pluginConfigData.base.resourceSavePath}/${resourceId}_${timestamp}.${end}`;
    }


    // **************************************** export ****************************************


    /**
     * 获取路径
     * @param resource
     */
    static getResourcePathString(resource: IResourceV2) {
        let db = new DataHandleV2();
        return db.getResourcePath(resource);
    }


    static async run(data: IResGetMemos) : Promise<IResDataHandleRunV2> {
        let dh = new DataHandleV2();

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