import {Address} from "../address/Address";

export interface Profile {
    id: string,
    created: Date,
    updated?: Date,
    username: string,
    email: string,
    emailVisibility: boolean,
    verified: boolean
    name: string,
    avatar: string
}

export const GuestProfile: Profile = {
    id: 'GUEST_PROFILE',
    name: 'Guest',
    username: '',
    email: '',
    created: new Date(),
    updated: undefined,
    verified: true,
    emailVisibility: true,
    avatar: ''
}

export const GuestAddress: Address = {
    id: 'UNKNOWN_ADDRESS',
    areaOrStreetName: '',
    buildingOrPremiseName: '',
    houseOrFlatNo: '',
    landmark: '',
    location: "Home",
    lng: 0,
    lat: 0
}

export const DemoProfile: Profile = {
    id: 'ARIF_PROFILE',
    name: 'Achmad Arif Rachim',
    username: '+971509018075',
    email: 'a.arif.r@gmail.com',
    created: new Date(),
    updated: undefined,
    verified: true,
    emailVisibility: true,
    avatar: ''
}