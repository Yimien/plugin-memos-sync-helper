import {createDocWithMd, sql} from "./api";
import {pluginConfigData} from "@/index";
import {isEmptyValue} from "@/utils";


export class SiYuanApiService {
    /**
     * 根据文档名称获取文档块
     * @param name - 根据文档名称获取文档块
     */
    static async getDocumentBlockByName(name: string): Promise<Block[]> {
        let sqlScript = `SELECT * FROM blocks WHERE content='${name}' && type='d'`;
        return await sql(sqlScript);
    }

    /**
     * 根据名称获取对应的文档ID，若不存在，自动创建
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

    static async getAttr(name: string, value: string) {
        let sqlScript = `SELECT * FROM attributes WHERE name='${name}' && value='${value}'`;
        return await sql(sqlScript);
    }

    static async getAttrByName(name: string) {
        let sqlScript = `SELECT * FROM attributes WHERE name='${name}'`;
        return await sql(sqlScript);
    }
}




