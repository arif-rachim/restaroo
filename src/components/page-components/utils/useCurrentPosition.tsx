import {useAppContext} from "../../useAppContext";
import L from "leaflet";
import {ButtonTheme, white} from "../../../routes/Theme";
import {Button} from "../Button";
import {MdOutlineCancel, MdOutlineLocationOn} from "react-icons/md";
import {Address} from "../../../model/Address";
import {nanoid} from "nanoid";

const PERMISSION_DENIED = {
    POSITION_UNAVAILABLE: 0,
    PERMISSION_DENIED: 1,
    TIMEOUT: 0,
    code: 1,
    message: 'Permission denied'
};

export function useCurrentPosition() {
    const appContext = useAppContext();
    return function getCurrentPosition(map?: L.Map): Promise<{ position?: Address, error?: GeolocationPositionError }> {
        return new Promise(resolve => {
            (async () => {
                const {state} = await navigator.permissions.query({name: "geolocation"});

                if (state === 'denied') {
                    resolve({error: PERMISSION_DENIED});
                }
                if (state === 'prompt') {
                    const isOk = await appContext.showModal(closePanel => {
                        return <div style={{
                            backgroundColor: white,
                            margin: 20,
                            borderRadius: 10,
                            padding: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 3px 5px -3px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{fontSize: 20, marginBottom: 10}}>Request authorization to use your location.</div>
                            <div style={{lineHeight: 1.5, marginBottom: 20}}>This application would like to request permission to use
                                your current location in order to provide you with a more pleasant experience when it comes to filling
                                out the information for your delivery address.
                            </div>
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button title={'OK'} icon={MdOutlineLocationOn} style={{border: 'none'}} theme={ButtonTheme.danger} onTap={() => closePanel(true)}/>
                                <Button title={'NO'} icon={MdOutlineCancel} style={{border: 'none'}} theme={ButtonTheme.subtle} onTap={() => closePanel(false)}/>
                            </div>
                        </div>
                    });
                    if(!isOk){
                        resolve({error: PERMISSION_DENIED});
                        return;
                    }
                }
                const {error,position} = await getLocation();
                if (position) {
                    const latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    if(map){
                        map.flyTo(latLng, 18);
                    }
                    const locationAddress = await getLocationAddress(latLng);
                    const address:Address = {
                        areaOrStreetName : locationAddress.displayName.replace(locationAddress.name+', ',''),
                        location : 'Home',
                        lng : latLng.lng,
                        lat : latLng.lat,
                        buildingOrPremiseName : locationAddress.name,
                        houseOrFlatNo : '',
                        landmark : '',
                        id : nanoid()
                    }
                    resolve({position:address});
                }else if(error){
                    resolve({error});
                }
            })();

        });
    }
}

function getLocation():Promise<{position?:GeolocationPosition,error?:GeolocationPositionError}>{
    return new Promise<{position?: GeolocationPosition; error?: GeolocationPositionError}>((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({position});
        }, (error) => {
            resolve({error})
        });
    })
}
// This is the flag to avoid overcalling the openstreet map
let lastRequestTime = 0;
let lastAddress = {
    displayName:'',
    name:'',
    state:'',
    road:''
};
export async function getLocationAddress(props:{lat:number,lng:number}){
    const currentTime = new Date().getTime();
    if(currentTime - lastRequestTime < 1000){
        return lastAddress;
    }
    lastRequestTime = currentTime;
    const result = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${props.lat}&lon=${props.lng}`);
    const json = await result.json();
    const displayName = json.display_name;
    const road = json.address.road;
    const name = json.name;
    const state = json.address.state;
    const address = {
        displayName,
        name,
        state,
        road
    }
    lastAddress = address;
    return address;
}