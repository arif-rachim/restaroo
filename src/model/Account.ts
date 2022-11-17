import {Auditable} from "./Auditable";

export interface Account extends Auditable{
    id : string,
    phoneNo : string,
    password : string,
    email : string,
}


export const GuestAccount:Account = {
    id : 'GUEST_ACCOUNT',
    phoneNo : '',
    email : '',
    password : '',
    createdAt : new Date(),
    createdBy : 'SYSTEM',
    lastUpdatedAt : undefined,
    lastUpdatedBy : undefined
}