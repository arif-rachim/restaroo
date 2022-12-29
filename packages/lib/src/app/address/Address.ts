export interface Address {
    id: string,
    location: 'Home' | 'Work' | 'Hotel' | string,
    houseOrFlatNo: string,
    buildingOrPremiseName: string,
    areaOrStreetName: string,
    landmark: string,
    lat: number,
    lng: number
}
