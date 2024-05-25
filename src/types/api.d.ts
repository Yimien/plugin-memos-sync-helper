interface IResGetNotebookConf {
    box: string;
    conf: NotebookConf;
    name: string;
}

export interface IReslsNotebooks {
    notebooks: Notebook[];
}

export interface IResUpload {
    errFiles: string[];
    succMap: { [key: string]: string };
}

export interface IResdoOperations {
    doOperations: doOperation[];
    undoOperations: doOperation[] | null;
}

export interface IResGetBlockKramdown {
    id: BlockId;
    kramdown: string;
}

export interface IResGetChildBlock {
    id: BlockId;
    type: BlockType;
    subtype?: BlockSubType;
}

export interface IResGetTemplates {
    content: string;
    path: string;
}

export interface IResReadDir {
    isDir: boolean;
    isSymlink: boolean;
    name: string;
}

interface IResExportMdContent {
    hPath: string;
    content: string;
}

interface IResBootProgress {
    progress: number;
    details: string;
}

interface IResForwardProxy {
    body: string;
    contentType: string;
    elapsed: number;
    headers: { [key: string]: string };
    status: number;
    url: string;
}

interface IResExportResources {
    path: string;
}

