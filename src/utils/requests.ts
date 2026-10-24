import {METHOD} from '@/constants/utils/request'
import {isEmptyValue} from '@/utils/index'
import {UA} from "@/utils/misc/user-agent";
import {pluginConfigData} from "@/index";
import {debugMessage} from "@/utils";


export class Requests {

    /**
     * 当前批次请求失败的诊断信息（供校验失败等场景向用户展示）
     */
    static lastError: string = '';

    /**
     * 累积记录当前批次的全部请求失败，checkAccessToken 等场景开始时 clear
     */
    static errorLog: string[] = [];

    /**
     * 记录一条请求失败诊断
     */
    private static recordError(message: string) {
        this.lastError = message;
        this.errorLog.push(message);
        if (this.errorLog.length > 12) {
            this.errorLog.shift();
        }
    }

    /**
     * 汇总当前批次的失败记录（去重）
     */
    static drainErrorSummary(): string {
        return [...new Set(this.errorLog)].join('；');
    }

    /**
     * 移除请求参数的空值
     * @param obj - 原请求参数
     */
    private static async removeEmptyValues(obj: any) {
        for (let key in obj) {
            if (isEmptyValue(obj[key])) {
                delete obj[key];
            }
        }
    }


    // **************************************** export ****************************************


    /**
     * 获取规范化的主机地址（去除尾部斜杠）
     */
    static getHost(): string {
        let host = (pluginConfigData?.base?.host || '').trim();
        return host.replace(/\/+$/, '');
    }

    /**
     * 获取规范化的 Token（去除首尾空格及多余的 Bearer 前缀）
     */
    static getToken(): string {
        let token = (pluginConfigData?.base?.token || '').trim();
        if (token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
        }
        return token;
    }

    /**
     * 生成请求地址
     * @param pathName
     */
    static getUrl(pathName: string) {
        const host = this.getHost();
        const path = pathName.startsWith('/') ? pathName : `/${pathName}`;
        return `${host}${path}`;
    }

    /**
     * 生成信息头
     */
    static getHeaders() {
        return new Headers({
            'User-Agent': UA.ua,
            'Authorization': `Bearer ${this.getToken()}`
        });
    }

    /**
     * 内核代理使用的请求头（forwardProxy 的 headers 为对象数组形式）
     */
    private static getProxyHeaderList() {
        return [
            {'Authorization': `Bearer ${this.getToken()}`},
            {'User-Agent': UA.ua}
        ];
    }

    /**
     * 通过思源内核 /api/network/forwardProxy 转发请求。
     * 思源 remote 模式下 webSecurity 为 true，页面直连第三方 http 地址会被
     * CORS / 混合内容策略拦截，此时改由内核（Go，无浏览器策略）代为请求。
     * 响应以 base64 编码回传，还原为合成 Response，保持与直连一致的下游接口。
     */
    static async forwardViaKernel(url: string, method: string, payload?: string | Uint8Array, contentType?: string): Promise<Response> {
        try {
            return await this.kernelForward(url, method, payload);
        } catch (error: any) {
            // docker 容器内核无法解析外部主机名（如 Tailscale 域名）时，
            // 保持端口不变，改用 host.docker.internal（指向宿主机）重试
            const message = String(error?.message || error);
            if (!message.includes('no such host')) {
                throw error;
            }
            debugMessage(pluginConfigData.debug.isDebug, "内核无法解析主机名，尝试 host.docker.internal", url);
            const rewritten = new URL(url);
            rewritten.hostname = 'host.docker.internal';
            return await this.kernelForward(rewritten.toString(), method, payload);
        }
    }

    private static async kernelForward(url: string, method: string, payload?: string | Uint8Array, contentType?: string): Promise<Response> {
        const body: any = {
            url: url,
            method: method,
            timeout: 30000,
            responseEncoding: 'base64',
            headers: this.getProxyHeaderList()
        };
        if (payload !== undefined) {
            if (payload instanceof Uint8Array) {
                // 二进制载荷以 base64 传递，避免字符串化破坏字节流
                let binary = '';
                for (let i = 0; i < payload.length; i++) {
                    binary += String.fromCharCode(payload[i]);
                }
                body.payload = btoa(binary);
                body.payloadEncoding = 'base64';
            } else {
                body.payload = payload;
            }
        }
        if (contentType !== undefined) {
            body.contentType = contentType;
        }

        const resp = await fetch('/api/network/forwardProxy', {
            method: METHOD.POST,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        const result = await resp.json();
        if (!result || result.code !== 0 || !result.data) {
            throw new Error(`内核代理请求失败: ${result?.msg || `HTTP ${resp.status}`}`);
        }

        const {status, contentType: responseContentType, body: bodyBase64} = result.data;
        const bytes = Uint8Array.from(atob(bodyBase64 || ''), c => c.charCodeAt(0));
        const headers = responseContentType ? {'Content-Type': responseContentType} : {};
        return new Response(bytes, {status: status, headers: headers});
    }

    /**
     * 直连优先、失败回落内核代理的文件上传（multipart/form-data）。
     * 手工构造 multipart 报文，以便回落内核代理时以 base64 转发原始字节。
     */
    static async upload(url: string, blob: Blob, filename: string, headers: Record<string, string> = {}): Promise<Response> {
        const boundary = `----siyuanImgBed${Date.now()}${Math.floor(Math.random() * 100000)}`;
        const safeFilename = filename.replace(/[^\x20-\x7e]/g, '_');
        const encoder = new TextEncoder();
        const head = encoder.encode(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="${safeFilename}"\r\n` +
            `Content-Type: ${blob.type || 'application/octet-stream'}\r\n\r\n`
        );
        const tail = encoder.encode(`\r\n--${boundary}--\r\n`);
        const fileBytes = new Uint8Array(await blob.arrayBuffer());
        const body = new Uint8Array(head.length + fileBytes.length + tail.length);
        body.set(head, 0);
        body.set(fileBytes, head.length);
        body.set(tail, head.length + fileBytes.length);

        const contentType = `multipart/form-data; boundary=${boundary}`;

        try {
            return await fetch(url, {
                method: METHOD.POST,
                headers: {...headers, 'Content-Type': contentType},
                body: body
            });
        } catch (error) {
            debugMessage(pluginConfigData.debug.isDebug, "直连上传失败，回落内核代理", error);
            return await this.forwardViaKernel(url, METHOD.POST, body, contentType);
        }
    }

    /**
     * 生成带查询参数的完整地址
     */
    private static buildUrl(pathName: string, data?: any): URL {
        const url = new URL(this.getUrl(pathName));
        if (data && Object.keys(data).length > 0) {
            url.search = new URLSearchParams(data).toString();
        }
        return url;
    }

    /**
     * 发送 GET 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async get(pathName: string, data?: any) {
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        const url = this.buildUrl(pathName, data);

        try {
            // 发送请求
            return await fetch(url, {
                method: METHOD.GET,
                headers: this.getHeaders()
            });
        } catch (error) {
            // 直连被浏览器策略拦截（remote 模式 CORS / 混合内容）时回落内核代理
            debugMessage(pluginConfigData.debug.isDebug, "直连请求失败，回落内核代理", error);
            return await this.forwardViaKernel(url.toString(), METHOD.GET);
        }
    }

    /**
     * 发送 POST 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async post(pathName: string, data: any){
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        const url = this.getUrl(pathName);
        const payload = data === undefined ? undefined : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            // 发送请求
            return await fetch(url, {
                method: METHOD.POST,
                body: data,
                headers: this.getHeaders()
            });
        } catch (error) {
            debugMessage(pluginConfigData.debug.isDebug, "直连请求失败，回落内核代理", error);
            return await this.forwardViaKernel(url, METHOD.POST, payload);
        }
    }

    /**
     * 发送 PUT 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async put(pathName: string, data: any) {
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        const url = this.getUrl(pathName);
        const payload = data === undefined ? undefined : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            // 发送请求
            return await fetch(url, {
                method: METHOD.PUT,
                body: data,
                headers: this.getHeaders()
            });
        } catch (error) {
            debugMessage(pluginConfigData.debug.isDebug, "直连请求失败，回落内核代理", error);
            return await this.forwardViaKernel(url, METHOD.PUT, payload);
        }
    }

    /**
     * 发送 DELETE 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async delete(pathName: string, data: any){
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        const url = this.buildUrl(pathName, data);

        try {
            // 发送请求
            return await fetch(url, {
                method: METHOD.DELETE,
                headers: this.getHeaders()
            });
        } catch (error) {
            debugMessage(pluginConfigData.debug.isDebug, "直连请求失败，回落内核代理", error);
            return await this.forwardViaKernel(url.toString(), METHOD.DELETE);
        }
    }

    /**
     * 发送请求
     * @param method - 请求方法
     * @param pathName - 请求路径
     * @param data - 请求参数
     */
    static async send(method: string, pathName: string, data?: any) {
        try {
            let response = null;
            if (method === METHOD.GET) {
                response = await this.get(pathName, data);
            } else if (method === METHOD.POST) {
                response = await this.post(pathName, data);
            } else if (method === METHOD.PUT) {
                response = await this.put(pathName, data);
            } else if (method === METHOD.DELETE) {
                response = await this.delete(pathName, data);
            }

            if (!response || !response.ok) {
                this.recordError(`${pathName.replace('/api/v1/', '')}:${response ? `HTTP ${response.status}` : '无响应'}`);
                if (response) {
                    debugMessage(pluginConfigData.debug.isDebug, `请求失败: ${method} ${pathName} -> HTTP ${response.status}`);
                }
                return null;
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await response.json();
            } else {
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch (parseError) {
                    this.recordError(`${pathName}:响应非JSON(${(contentType || 'empty')}, ${text.length} bytes)`);
                    debugMessage(pluginConfigData.debug.isDebug, `响应 JSON 解析失败: ${pathName}`, text.slice(0, 200));
                    return null;
                }
            }
        } catch (error: any) {
            this.recordError(`${pathName}:${error?.message || error}`);
            debugMessage(pluginConfigData.debug.isDebug, `请求异常: ${method} ${pathName}`, error);
            return null;
        }
    }
}
