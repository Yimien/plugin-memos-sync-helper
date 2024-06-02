import {pluginConfigData} from "@/index";
import {contentsType, resourceType} from "@/constants/plugin";
import {IMemo, IResource, IResources} from "@/types/memos";
import {IContent, IContents, INewMemo, INewMemos} from "@/types/plugin";
import {debugMessage, isEmptyValue} from "@/utils";
import {regexMemosContent} from "@/utils/regexp";
import {stringSplit} from "@/utils/misc/string";
import {Handle} from "@/controllers/plugin/common/handle/handle";


export abstract class DataHandleBase {
    protected relations: any[];
    protected resources: any[];
    protected newMemos: any[];


    constructor() {
        this.newMemos = [];
        this.relations = [];
        this.resources = [];
    }


    /**
     * 批量处理 Memos
     * @param memos
     */
    protected async handleMemos(memos: any[]) {
        for (let memo of memos) {
            this.newMemos.push(await this.handelMemo(memo));
        }
    }


    /**
     * 处理 Memo
     * @param memo
     * @protected
     */
    protected async handelMemo(memo: any) {
        debugMessage(pluginConfigData.debug.isDebug, "开始处理 Memos");

        let memoId: string = this.getMemoId(memo);
        let memoUid: string = this.getMemoUid(memo);
        let updateTime: string = this.getUpdateTime(memo);
        let title: string = `${updateTime}・#${memoId}`;
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
    };


    /**
     * 获取 Memo Id
     * @param memo
     * @protected
     */
    protected abstract getMemoId(memo: IMemo): string;


    /**
     * 获取 Memo UId
     * @param memo
     * @protected
     */
    protected abstract getMemoUid(memo: IMemo): string;


    /**
     * 获取更新时间
     * @param memo
     * @protected
     */
    protected abstract getUpdateTime(memo: IMemo): string;


    /**
     * 处理资源
     * @param memo
     * @param contents
     * @protected
     */
    protected abstract handleResources(memo: IMemo, contents: IContents): void;


    /**
     * 处理引用
     * @param memo
     * @protected
     */
    protected abstract handleRelations(memo: IMemo): void;


    /**
     * 获取 contents
     * @param memo
     * @private
     */
    protected async getContents(memo: IMemo): Promise<IContents> {
        let contents: IContents = [];
        let content = '';

        let splits = stringSplit(memo.content, '\n'); // 拆分源数据

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
    protected saveContents(contents: IContents, content: string, type: string | number) {
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
    protected async handleContent(contents: IContents) {
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
     * 将资源转换成文本写入 contents
     * @param contents
     * @param resources
     * @protected
     */
    protected getResourceContents(contents: IContents, resources: IResources) {
        for (let resource of resources) {
            let md = this.getResourceMarkdown(resource);
            contents.push({
                type: contentsType.resource,
                content: md
            });
        }
    }


    /**
     * 生成资源的 markdown 文本
     * @param resource
     */
    protected getResourceMarkdown(resource: IResource) {
        let filename = resource.filename;
        let end = filename.split('.').pop();
        let path = this.getResourcePath(resource);
        let type = resource.type.split('/')[0];

        if (type == resourceType.image) {
            return Handle.handleImage(filename, path);
        }

        if (type == resourceType.video && pluginConfigData.advanced.isHandleVideo) {
            let videoFormatString = pluginConfigData.advanced.videoFormats;
            let formats = videoFormatString.split(';');
            if (formats.includes(end)) {
                return Handle.handleVideo(path);
            }
        }

        return Handle.handleResource(filename, path);
    }

    /**
     * 生成资源文件路径
     * @param resource
     * @protected
     */
    protected abstract getResourcePath(resource: IResource): string;


    /**
     * Memos 列表排序
     * @param memosList
     * @param asc - 默认升序
     */
    static sortMemos(memosList: INewMemos, asc: boolean) {
        memosList.sort((a, b) => {
            const timeA = new Date(a.updateTime).getTime();
            const timeB = new Date(b.updateTime).getTime();
            return asc ? timeA - timeB : timeB - timeA;
        });
    }
}