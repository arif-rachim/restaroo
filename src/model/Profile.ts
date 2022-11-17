import {Auditable} from "./Auditable";

export interface Profile extends Auditable{
    id : string,
    name : string,
    accountId:string
}

export const GuestProfile:Profile = {
    id : 'GUEST_PROFILE',
    createdAt : new Date(),
    name : 'Guest',
    accountId : 'GUEST_ACCOUNT',
    createdBy : 'SYSTEM',
    lastUpdatedAt : undefined,
    lastUpdatedBy : undefined
}