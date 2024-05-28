import {debugMessage, isEmptyValue} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import {IMemos, IRelation, IResource} from "@/types/memos/v2";
import {stringSplit} from "@/utils/misc/string";
import {ContentHandle} from "@/controllers/plugin/common/content-handle";
import {contentsType, MEMOS_ASSETS} from "@/constants";
import {regexMemosContent} from "@/utils/regexp";
import {toChinaTime} from "@/utils/misc/time";
import {IContent, IResHandleMemos, IResRun} from "@/types/memos/v2/handle";
import moment from "moment/moment";
import {ResourceHandle} from "@/controllers/plugin/common/resource-handle";

/**
 * 数据处理
 */
export class Handle {
    private static new: IResHandleMemos[] = [];
    private static resources: IResource[] = [];
    private static relations: IRelation[] = [];

    /**
     * 批量处理 Memos
     * @param memos
     */
    static async batchHandleMemos(memos: IMemos[]) {
        // 批量处理 Memos
        for (let m of memos) {
            Handle.new.push(await Handle.handelMemos(m));
        }
    }

    /**
     * 处理 Memos
     * @param memos
     */
    static async handelMemos(memos: IMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "开始处理 Memos");

        let memosId = Handle.getMemosId(memos);
        let title = Handle.getTitle(memos);
        let contents = await Handle.getContents(memos);
        let resources = Handle.getResources(memos.resources);

        Handle.resources = Handle.resources.concat(memos.resources);
        Handle.relations = Handle.relations.concat(memos.relations);

        let result: IResHandleMemos = {
            memosId: memosId,
            title: title,
            contents: contents,
            resources: resources,
            memos: memos
        }

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", result);

        return result;
    }

    /**
     * 获取 Memos Id
     * @param memos
     */
    static getMemosId(memos: IMemos) {
        return memos.name.split('/').pop();
    }

    /**
     * 生成 Memos 名称
     * @param memos
     */
    static getTitle(memos: IMemos) {
        return `${toChinaTime(memos.updateTime)}・#${Handle.getMemosId(memos)}`
    }

    /**
     * 获取 contents
     * @param memos
     * @private
     */
    private static async getContents(memos: IMemos) {
        let contents: IContent[] = [];
        let content = '';

        let splits = stringSplit(memos.content, '\n'); // 拆分源数据

        for (let m of splits) {
            // 判断是否是嵌入内容
            if (regexMemosContent.embedded.test(m)) {
                Handle.saveContents(contents, content, contentsType.text);
                Handle.saveContents(contents, m, contentsType.embedded);
                content = "";
            } else {
                content += m;
                if (m !== splits[splits.length - 1]) {
                    content += '\n';
                }
            }
        }
        Handle.saveContents(contents, content, contentsType.text);

        await Handle.handleContent(contents);

        return contents;
    }

    /**
     * 生成 contents
     * @param contents
     * @param content
     * @param type
     */
    static saveContents(contents: IContent[], content: string, type: string | number) {
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
    static async handleContent(contents: IContent[]) {
        for (let i = 0; i < contents.length; i++) {
            let type = contents[i].type;
            let content = contents[i].content;
            let result = content;

            // 跳过嵌入内容
            if (type === contentsType.embedded) {
                continue;
            }

            // 双链处理
            if (pluginConfigData.advanced.isHandleBacklinks && regexMemosContent.backlinks.test(content)) {
                result = await ContentHandle.handleBacklinks(content);
            }

            // 网址处理
            if (pluginConfigData.advanced.isHandleHref && regexMemosContent.href.test(content)) {
                result = ContentHandle.handleHref(content);
            }

            // 标签处理
            if (regexMemosContent.tag.test(content)) {
                result = ContentHandle.handleTags(content);
            }

            contents[i].content = result;
        }
    }

    static getResources(resources: IResource[]) {
        let result = [];
        for (let resource of resources) {
            let md = Handle.getResourceMarkdown(resource);
            result.push(md);
        }
        return result;
    }

    static getResourceMarkdown(resource: IResource) {
        let filename = resource.filename;
        let resourceId = resource.name.split('/').pop();
        let timestamp = moment(toChinaTime(resource.createTime)).unix();
        let end = filename.split('.').pop();
        let path = `${MEMOS_ASSETS}/${resourceId}_${timestamp}.${end}`;
        let type = resource.type.split('/')[0];

        if (type == "image") {
            return ResourceHandle.handleImage(filename, path);
        }

        if (type == "video" && pluginConfigData.advanced.isHandleVideo) {
            let videoFormatString = pluginConfigData.advanced.videoFormats;
            let formats = videoFormatString.split(';');
            if (formats.includes(end)) {
                return ResourceHandle.handleVideo(path);
            }
        }

        return ResourceHandle.handleResource(filename, path);
    }

    static async run(data: IResGetMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        debugMessage(pluginConfigData.debug.isDebug, "正在处理 Memos...");

        await Handle.batchHandleMemos(data.new);

        let result: IResRun = {
            resources: Handle.resources,
            relations: Handle.relations,
            old: data.old,
            new: Handle.new
        }

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", result);

        debugMessage(pluginConfigData.debug.isDebug, "数据处理完成", "", true);
        return result;
    }
}