export class ResourceHandle {
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