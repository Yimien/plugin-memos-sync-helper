import {regexMemosContent} from "@/utils/regexp";
import {pluginConfigData} from "@/index";
import {SiYuanApiService} from "@/controllers/siyuan";


export class Handle {

    /**
     * 标签处理
     * @param content
     */
    static handleTags(content: string) {
        let regex = regexMemosContent.tag;
        let result: string;

        if (pluginConfigData.advanced.isSuperLabel) {
            const labelName = pluginConfigData.advanced.labelName;
            result = content.replace(regex, (match) => `${labelName}/${match}#`);
        } else {
            result = content.replace(regex, (match) => `${match}#`);
        }
        return result;
    }

    static handleTagBlock(content: string) {
        const regex = /([^#]*)(#)/; // 捕获组1匹配所有非#字符，捕获组2匹配#
        return content.replace(regex, "\$1\n\$2");
    }

    /**
     * 网址处理
     * @param content
     */
    static handleHref(content: string) {
        let regex = regexMemosContent.href;
        return content.replace(regex, (match) => `[${match}](${match})`);
    }

    /**
     * 双链处理
     * @param content
     */
    static async handleBacklinks(content: string) {
        let regex = regexMemosContent.backlinks;

        let matchList = content.match(regex);
        for (let documentName of matchList) {
            let documentId = await SiYuanApiService.getDocumentIdByName(documentName);
            // content = content.replace(`((${documentName}))`, (match) => `((${documentId} "${match}"))`)
            content = content.replace(`((${documentName}))`, `((${documentId} "${documentName}"))`);
        }
        console.log("处理中", content)
        return content;
    }

    /**
     * 嵌入内容处理
     * @param content
     */
    static handleEmbeddedContent(content: string) {
        let regex = regexMemosContent.embedded;
        let matchList = content.match(regex);
        return matchList[0].split('/').pop();
    }

    /**
     * 处理图片
     * @param name
     * @param path
     */
    static handleImage(name: string, path: string) {
        // ![名称](路径)
        return `![${name}](${path})`;
    }

    /**
     * 处理其它资源
     * @param name
     * @param path
     */
    static handleResource(name: string, path: string) {
        return `[${name}](${path})`;
    }

    /**
     * 处理视频
     * @param path
     */
    static handleVideo(path: string) {
        return `<video controls='controls' src='${path}' data-src='${path}' style='width: 1384px; height: 723px;'></video>`
    }
}