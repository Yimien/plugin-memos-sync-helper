export class Icons {
    private static iconsDict = {
        completed: {
            name: "iconMemosCompleted",
            icon: `<symbol id="iconMemosCompleted" viewBox="0 0 1024 1024"><path d="M640 795.136A155.136 155.136 0 0 0 795.136 640h31.04a155.136 155.136 0 0 0 155.136 155.136v31.04a155.136 155.136 0 0 0-155.136 155.136h-31.04A155.136 155.136 0 0 0 640 826.24v-31.04zM296.064 598.72c-9.92 26.624-18.304 51.2-25.792 76.096 40.96-29.76 89.6-48.64 145.792-55.68C523.328 605.824 618.56 535.04 666.88 446.08L604.736 384l60.16-60.352 42.752-42.752c18.304-18.304 39.04-52.224 60.928-100.992-238.72 36.992-384.768 183.104-472.512 418.88z m429.248-214.848l42.688 42.624c-42.688 128-170.688 256-341.312 277.376-113.92 14.208-184.96 92.416-213.44 234.624H128c42.688-256 128-853.312 768-853.312-42.624 127.872-85.248 213.184-127.872 255.872l-42.816 42.88z"></path></symbol>`
        },
        waiting: {
            name: "iconMemosWaiting",
            icon: `<symbol id="iconMemosWaiting" viewBox="0 0 32 32"><path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"></path></symbol>`
        },
        downloading: {
            name: "iconMemosDownloading",
            icon: `<symbol id="iconMemosDownloading" viewBox="0 0 32 32"><path d="M25.6 12.677c0-5.302-4.298-9.6-9.6-9.6s-9.6 4.298-9.6 9.6c-3.535 0-6.4 2.865-6.4 6.4s2.865 6.4 6.4 6.4h3.2v-2.56h-3.2c-2.117 0-3.84-1.723-3.84-3.84s1.723-3.84 3.84-3.84h2.56v-2.56c0-3.882 3.158-7.040 7.040-7.040s7.040 3.158 7.040 7.040v2.56h2.56c2.117 0 3.84 1.723 3.84 3.84s-1.722 3.84-3.84 3.84h-3.2v2.56h3.2c3.534 0 6.4-2.865 6.4-6.4s-2.866-6.4-6.4-6.4z"></path><path d="M15.981 28.923l6.915-7.438-2.014-1.875-3.462 3.726v-10.516h-2.88v10.515l-3.462-3.724-2.013 1.875z"></path></symbol>`
        }
    }

    private static getUseIcon(iconName: string) {
        return `<svg><use xlink:href="#${iconName}"></use></svg>`;
    }

    static getIcon() {
        return {
            /**
             * 未检查到可同步数据或者同步完成
             */
            completed: {
                name: Icons.iconsDict.completed.name,
                icon: Icons.iconsDict.completed.icon,
                use: Icons.getUseIcon(Icons.iconsDict.completed.name)
            },
            /**
             * 检查到可同步数据
             */
            waiting: {
                name: Icons.iconsDict.waiting.name,
                icon: Icons.iconsDict.waiting.icon,
                use: Icons.getUseIcon(Icons.iconsDict.waiting.name)
            },
            /**
             * 同步下载中
             */
            downloading: {
                name: Icons.iconsDict.downloading.name,
                icon: Icons.iconsDict.downloading.icon,
                use: Icons.getUseIcon(Icons.iconsDict.downloading.name)
            },
            default: {
                name: Icons.iconsDict.completed.name,
                icon: Icons.iconsDict.completed.icon,
                use: Icons.getUseIcon(Icons.iconsDict.completed.name)
            }
        }
    }

    static getIconsString() {
        let start: string = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: none;\">";
        let end: string = "</svg>";
        for (const key in Icons.iconsDict) {
            start += Icons.iconsDict[key].icon;
        }
        return start + end;
    }
}
