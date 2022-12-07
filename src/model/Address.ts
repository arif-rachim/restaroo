
export interface Address {
    id: string,
    location: 'Home' | 'Work' | 'Hotel' | string,
    houseOrFlatNo: string,
    buildingOrPremiseName: string,
    areaOrStreetName: string,
    landmark: string,
    defaultAddress:boolean,
    lat: number,
    lng: number
}
