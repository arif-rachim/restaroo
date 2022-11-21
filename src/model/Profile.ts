import {Auditable} from "./Auditable";

export interface Profile extends Auditable {
    id: string,
    phoneNo: string,
    email: string,
    name: string,
    birthday?: Date,
    gender: 'Male' | 'Female'
}

export const GuestProfile: Profile = {
    id: 'GUEST_PROFILE',
    name: 'Guest',
    birthday: new Date(),
    phoneNo: '',
    email: '',
    createdAt: new Date(),
    createdBy: 'SYSTEM',
    lastUpdatedAt: undefined,
    lastUpdatedBy: undefined,
    gender: 'Male'
}

export const DemoProfile: Profile = {
    id: 'ARIF_PROFILE',
    name: 'Achmad Arif Rachim',
    birthday: new Date(),
    phoneNo: '+971509018075',
    email: 'a.arif.r@gmail.com',
    createdAt: new Date(),
    createdBy: 'SYSTEM',
    lastUpdatedAt: undefined,
    lastUpdatedBy: undefined,
    gender: 'Male'
}