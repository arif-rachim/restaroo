
export interface Table{
    id:string;// "b1sud5b6p0i9sp9",
    created:string;// "2022-12-20 17:58:46.199Z",
    updated:string;// "2022-12-26 08:07:22.441Z",
    name: string;// "address",
    type: 'base'|'auth';// "base",
    system:boolean; //false,
    listRule:string;// "",
    viewRule:string;// "",
    createRule: string;// "",
    updateRule: string;// "",
    deleteRule: string;// "",
    schema : (TextSchema|NumberSchema|RelationSchema|FileSchema|BoolSchema)[];
    options : unknown;
}

interface Schema{
    system: boolean;// false,
    id:string;// "6xec7ize",
    name:string;// "location",
    type:string;// "text",
    required: boolean;// true,
    unique: boolean;// false,
    options : unknown;
}

export interface TextSchema extends Schema{
    type : 'text';
    options : {
        min? : number;
        max? : number;
        pattern : string
    };
}

export interface NumberSchema extends Schema{
    type : 'number';
    options : {
        min? : number;
        max? : number;
    };
}


export interface RelationSchema extends Schema{
    type : 'relation';
    options : {
        maxSelect?: number;//1, if empty that means its unlimted
        collectionId:string;// "_pb_users_auth_",
        cascadeDelete:boolean;// true
    }
}

export interface FileSchema extends Schema{
    type : 'file';
    options : {
        maxSelect: number;//1,
        maxSize:number;// 5242880,
        mimeTypes: string[],
        thumbs: string[];//null
    }
}
export interface BoolSchema extends Schema{
    type : 'bool';
}