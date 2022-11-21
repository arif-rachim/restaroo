export interface Auditable {
    createdAt: Date,
    createdBy: string,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: string
}