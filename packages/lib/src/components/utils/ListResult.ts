export interface BaseModel {
    id: string;
    created: string;
    updated: string;

    [key: string]: any;
}

export interface ListResult<M extends BaseModel> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: Array<M>;
}