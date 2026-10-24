import {Requests} from "@/utils/requests";
import {pluginConfigData} from "@/index";
import {debugMessage} from "@/utils";
import {IResourceV2} from "@/types/memos/v2";



/**
 * 图床资源的类别
 */
export enum ImgbedCategory {
    image = "image",
    video = "video",
    file = "file",
    custom = "custom"
}

const IMAGE_EXTENSIONS: string[] = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "heif", "avif", "ico", "tiff"];
const VIDEO_EXTENSIONS: string[] = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "flv", "wmv", "3gp", "ts"];


export class ImgBedService {

    /**
     * 最近一次上传失败的诊断信息
     */
    static lastError: string = '';

    /**
     * 判断资源应当上传到图床时归属的类别；返回 null 表示不参与图床分类
     * @param resource - Memos 资源
     */
    static categorize(resource: IResourceV2): ImgbedCategory | null {
        const extension = (resource.filename || "").split(".").pop()?.toLowerCase() || "";

        const customExtensions = (pluginConfigData.imgbed?.customExtensions || "")
            .split(";")
            .map(item => item.trim().toLowerCase())
            .filter(item => item.length > 0);
        if (customExtensions.length > 0 && customExtensions.includes(extension)) {
            return ImgbedCategory.custom;
        }

        const mimeType = (resource.type || "").split("/")[0];
        if (mimeType === "image" || IMAGE_EXTENSIONS.includes(extension)) {
            return ImgbedCategory.image;
        }
        if (mimeType === "video" || VIDEO_EXTENSIONS.includes(extension)) {
            return ImgbedCategory.video;
        }
        return ImgbedCategory.file;
    }

    /**
     * 资源是否应当上传至图床
     * @param resource - Memos 资源
     */
    static shouldUpload(resource: IResourceV2): boolean {
        const imgbed = pluginConfigData.imgbed;
        if (!imgbed?.enabled) {
            return false;
        }

        const selectedTypes: string[] = Array.isArray(imgbed.resourceTypes) ? imgbed.resourceTypes : [];
        if (selectedTypes.length === 0) {
            return false;
        }

        const category = this.categorize(resource);
        return category !== null && selectedTypes.includes(category);
    }

    /**
     * 上传资源到图床，成功时返回可直接引用的外链；失败返回 null（调用方回退本地落盘）
     * @param blob - 资源二进制
     * @param filename - 资源文件名
     */
    static async upload(blob: Blob, filename: string): Promise<string | null> {
        const imgbed = pluginConfigData.imgbed;
        if (!imgbed?.enabled || isEmptyText(imgbed.uploadUrl)) {
            return null;
        }

        try {
            const host = imgbed.uploadUrl.trim().replace(/\/+$/, "");
            const form = new FormData();
            form.append("file", blob, filename);

            const headerRecord: Record<string, string> = {};
            const token = (imgbed.token || "").trim();
            if (token.length > 0) {
                headerRecord["Authorization"] = `Bearer ${token}`;
            }

            const response = await Requests.upload(`${host}/upload`, blob, filename, headerRecord, true);

            if (!response.ok) {
                this.lastError = `上传响应 HTTP ${response.status}（直连与内核代理均失败）`;
                debugMessage(pluginConfigData.debug.isDebug, `图床上传失败: HTTP ${response.status}`);
                return null;
            }

            const result = await response.json();
            const src = result?.[0]?.src;
            if (isEmptyText(src)) {
                this.lastError = `图床响应异常: ${JSON.stringify(result).slice(0, 200)}`;
                debugMessage(pluginConfigData.debug.isDebug, "图床响应中缺少 src 字段", result);
                return null;
            }

            // src 形如 /file/xxxx；文档内引用使用外链地址（留空则与上传地址相同）
            const publicHost = (isEmptyText(imgbed.publicUrl) ? imgbed.uploadUrl : imgbed.publicUrl).trim().replace(/\/+$/, "");
            const link = src.startsWith("http") ? src : `${publicHost}${src}`;
            debugMessage(pluginConfigData.debug.isDebug, `图床上传成功: ${filename} -> ${link}`);
            return link;
        } catch (error: any) {
            this.lastError = String(error?.message || error);
            debugMessage(pluginConfigData.debug.isDebug, "图床上传异常，回退本地落盘", error);
            return null;
        }
    }
}


function isEmptyText(value: any): boolean {
    return value === null || value === undefined || String(value).trim().length === 0;
}
