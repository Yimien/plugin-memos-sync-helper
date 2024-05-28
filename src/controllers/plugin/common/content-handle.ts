import {regexMemosContent} from "@/utils/regexp";
import {pluginConfigData} from "@/index";
import {getDocumentIdByName} from "@/controllers/siyuan";


export class ContentHandle {

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
            let documentId = await getDocumentIdByName(documentName);
            content = content.replace(`((${documentName}))`, (match) => `((${documentId} "${match}"))`)
        }
        return content;
    }



}