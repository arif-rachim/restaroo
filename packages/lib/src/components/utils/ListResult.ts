
export interface BaseModel {
    [key: string]: any;
    id: string;
    created: string;
    updated: string;
}

export interface ListResult<M extends BaseModel> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: Array<M>;
}