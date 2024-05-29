import {debugMessage, isEmptyValue} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import {IMemo, IMemos, IRelation, IResource} from "@/types/memos/v2";
import {stringSplit} from "@/utils/misc/string";
import {Handle} from "@/controllers/plugin/common/handle";
import {contentsType} from "@/constants/plugin";
import {regexMemosContent} from "@/utils/regexp";
import {toChinaTime} from "@/utils/misc/time";
import {IContent, IResHandleMemos, IResRun} from "@/types/memos/v2/handle";
import moment from "moment/moment";
import {MEMOS_ASSETS} from "@/constants";

/**
 * 数据处理
 */
export class DataHandle {
    relations: IRelation[];
    resources: IResource[];
    newMemos: IResHandleMemos[];

    constructor() {
        this.resources = [];
        this.relations = [];
        this.newMemos = [];
    }

    /**
     * 批量处理 Memos
     * @param memos
     */
    private async handleMemos(memos: IMemos) {
        // 批量处理 Memos
        for (let memo of memos) {
            this.newMemos.push(await this.handelMemo(memo));
        }
    }

    /**
     * 处理 Memo
     * @param memo
     */
    private async handelMemo(memo: IMemo) {
        debugMessage(pluginConfigData.debug.isDebug, "开始处理 Memos");

        let memoId = this.getMemoId(memo);
        let title = this.getTitle(memo);
        let contents = await this.getContents(memo);
        this.getResources(contents, memo.resources);
        // this.relations = [...new Set([...this.relations, ...memo.relations])];
        this.resources = this.resources.concat(memo.resources);
        for (let relation of memo.relations) {
            const exists = this.relations.some(r =>
                relation.memo === r.memo && relation.relatedMemo === r.relatedMemo
            );
            if (!exists) {
                this.relations.push(relation);
            }
        }

        let result: IResHandleMemos = {
            id: memoId,
            uid: memo.uid,
            title: title,
            contents: contents,
            memos: memo
        };

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", result);

        return result;
    }

    /**
     * 获取 Memo Id
     * @param memos
     */
    private getMemoId(memos: IMemo) {
        return memos.name.split('/').pop();
    }

    /**
     * 生成 Memo 名称
     * @param memos
     */
    private getTitle(memos: IMemo) {
        return `${toChinaTime(memos.updateTime)}・${this.getMemoId(memos)}`
    }

    /**
     * 获取 contents
     * @param memos
     * @private
     */
    private async getContents(memos: IMemo) {
        let contents: IContent[] = [];
        let content = '';

        let splits = stringSplit(memos.content, '\n'); // 拆分源数据

        for (let m of splits) {
            // 判断是否是嵌入内容
            if (regexMemosContent.embedded.test(m)) {
                this.saveContents(contents, content, contentsType.text);
                this.saveContents(contents, m, contentsType.embedded);
                content = "";
            } else {
                content += m;
                if (m !== splits[splits.length - 1]) {
                    content += '\n';
                } else {
                    this.saveContents(contents, content, contentsType.text);
                }
                // Handle.saveContents(contents, m, contentsType.text);
            }
        }

        await this.handleContent(contents);

        return contents;
    }

    /**
     * 生成 contents
     * @param contents
     * @param content
     * @param type
     */
    private saveContents(contents: IContent[], content: string, type: string | number) {
        if (isEmptyValue(content)) {
            return;
        }

        let temp: IContent = {
            type: type,
            content: content
        }
        contents.push(temp);
    }

    /**
     * 处理 contents
     * @param contents
     */
    private async handleContent(contents: IContent[]) {
        for (let i = 0; i < contents.length; i++) {
            let type = contents[i].type;
            let content = contents[i].content;
            let result = content;

            // 处理嵌入内容
            if (type === contentsType.embedded) {
                result = Handle.handleEmbeddedContent(content);
            }

            // 双链处理
            if (pluginConfigData.advanced.isHandleBacklinks && regexMemosContent.backlinks.test(content)) {
                result = await Handle.handleBacklinks(content);
            }

            // 网址处理
            if (pluginConfigData.advanced.isHandleHref && regexMemosContent.href.test(content)) {
                result = Handle.handleHref(content);
            }

            // 标签处理
            if (regexMemosContent.tag.test(content)) {
                result = Handle.handleTags(content);
            }

            contents[i].content = result;
        }
    }

    /**
     * 处理资源，写入 contents
     * @param contents
     * @param resources
     * @private
     */
    private getResources(contents: IContent[], resources: IResource[]) {
        for (let resource of resources) {
            let md = this.getResourceMarkdown(resource);
            contents.push({
                type: contentsType.resource,
                content: md
            });
        }
    }

    /**
     * 获取资源存储路径
     * @param resource
     */
    static getResourcePath(resource: IResource) {
        let filename = resource.filename;
        let resourceId = resource.name.split('/').pop();
        let timestamp = moment(toChinaTime(resource.createTime)).unix();
        let end = filename.split('.').pop();
        return `${MEMOS_ASSETS}/${resourceId}_${timestamp}.${end}`;
    }

    /**
     * 生成资源的 markdown 文本
     * @param resource
     */
    private getResourceMarkdown(resource: IResource) {
        let filename = resource.filename;
        let end = filename.split('.').pop();
        let path = DataHandle.getResourcePath(resource);
        let type = resource.type.split('/')[0];

        if (type == "image") {
            return Handle.handleImage(filename, path);
        }

        if (type == "video" && pluginConfigData.advanced.isHandleVideo) {
            let videoFormatString = pluginConfigData.advanced.videoFormats;
            let formats = videoFormatString.split(';');
            if (formats.includes(end)) {
                return Handle.handleVideo(path);
            }
        }

        return Handle.handleResource(filename, path);
    }


    // **************************************** export ****************************************


    /**
     * Memos 列表排序
     * @param memosList
     * @param asc - 默认升序
     */
    static sortMemos(memosList: IResHandleMemos[], asc: boolean) {
        memosList.sort((a, b) => {
            const timeA = new Date(a.memos.updateTime).getTime();
            const timeB = new Date(b.memos.updateTime).getTime();
            return asc ? timeA - timeB : timeB - timeA;
        });
    }

    static async run(data: IResGetMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        let dh = new DataHandle();

        await dh.handleMemos(data.new);

        let result: IResRun = {
            resources: dh.resources,
            relations: dh.relations,
            old: data.old,
            new: dh.newMemos
        }

        debugMessage(pluginConfigData.debug.isDebug, "数据处理结果", result);
        return result;
    }
}