import {Auditable} from "./Auditable";
import {Address} from "./Address";

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

export const GuestAddress:Address = {
    id : 'UNKNOWN_ADDRESS',
    areaOrStreetName : '',
    buildingOrPremiseName : '',
    houseOrFlatNo : '',
    landmark : '',
    location : "Home",
    lng : 0,
    lat : 0,
    defaultAddress : false
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