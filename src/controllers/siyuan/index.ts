import {appendBlock, createDocWithMd, getIDsByHPath, getNotebookConf, prependBlock, renderSprig, sql} from "./api";
import {pluginConfigData} from "@/index";
import {isEmptyValue} from "@/utils";
import {IResdoOperations} from "@/types/siyuan/api";
import {formatDate} from "@/utils/misc/time";


export class SiYuanApiService {
    /**
     * 根据文档名称获取文档块
     * @param name - 文档名称
     */
    static async getDocumentBlockByName(name: string): Promise<Block[]> {
        let sqlScript = `SELECT * FROM blocks WHERE content='${name}' && type='d'`;
        return await sql(sqlScript);
    }

    /**
     * 根据文档名称获取对应的文档ID，若不存在，自动创建
     * @param name - 文档名称
     */
    static async getDocumentIdByName(name: string): Promise<string> {
        let notebookId = pluginConfigData.base.notebook;
        let subjectPath = pluginConfigData.advanced.subjectPath;

        let documentId: string;

        // 查询文档块
        let documentBlocks = await this.getDocumentBlockByName(name);

        // 判断是否已存在文档块，若不存在，则自行创建
        if (isEmptyValue(documentBlocks) || documentBlocks.length === 0) {
            // 不存在，自行创建
            let path = `${subjectPath}/${name}`;
            documentId = await createDocWithMd(notebookId, path, "");
        } else {
            // 存在，获取ID
            documentId = documentBlocks[0].id;
        }

        return documentId
    }

    /**
     * 根据人类可读路径获取文档ID
     * @param notebookId
     * @param path
     */
    static async getDocumentIdByHPath(notebookId: string, path: string): Promise<string> {
        let responseData = await getIDsByHPath(notebookId, path);

        if (!isEmptyValue(responseData) && responseData.length > 0) {
            return responseData[0];
        }

        // 自动创建
        return await createDocWithMd(notebookId, path, "");
    }

    /**
     * 根据属性名和属性值获取属性信息
     * @param name
     * @param value
     */
    static async getAttributes(name: string, value: string) {
        let sqlScript = `SELECT * FROM attributes WHERE name='${name}' && value='${value}'`;
        return await sql(sqlScript);
    }

    /**
     * 根据属性名获取属性信息
     * @param name
     */
    static async getAttrByName(name: string) {
        let sqlScript = `SELECT * FROM attributes WHERE name='${name}'`;
        return await sql(sqlScript);
    }

    /**
     * 解析响应参数，获取对应的 block Id
     * @param response
     */
    static getBlockId(response : IResdoOperations[]) {
        return response[0].doOperations[0].id;
    }

    static async getDailyNotePath(notebookId: string, datetime: string) {
        // 读取笔记本配置
        let responseData = await getNotebookConf(notebookId);

        if (isEmptyValue(responseData)) {
            return;
        }

        let dailyNoteSavePath: string = responseData.conf.dailyNoteSavePath;

        let dateString = formatDate(datetime);
        let sprig = `toDate "2006-01-02" "${dateString}"`;
        dailyNoteSavePath = dailyNoteSavePath.replace(/now/g, sprig);

        return await renderSprig(dailyNoteSavePath);
    }


    static async appendDailyNoteBlockByDatetime(notebookId: string, data: string, datetime: string): Promise<IResdoOperations[]> {
        let hpath = await SiYuanApiService.getDailyNotePath(notebookId, datetime);
        let pageId = await SiYuanApiService.getDocumentIdByHPath(notebookId, hpath);
        return await appendBlock("markdown", data, pageId);
    }

    static async prependDailyNoteBlockByDatetime(notebookId: string, data: string, datetime: string): Promise<IResdoOperations[]> {
        let hpath = await SiYuanApiService.getDailyNotePath(notebookId, datetime);
        let pageId = await SiYuanApiService.getDocumentIdByHPath(notebookId, hpath);
        return await prependBlock("markdown", data, pageId);
    }
}




