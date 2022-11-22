import {useAppContext} from "../../useAppContext";
import L from "leaflet";
import {ButtonTheme, white} from "../../../routes/Theme";
import {Button} from "../Button";
import {MdOutlineCancel, MdOutlineLocationOn} from "react-icons/md";

const PERMISSION_DENIED = {
    POSITION_UNAVAILABLE: 0,
    PERMISSION_DENIED: 1,
    TIMEOUT: 0,
    code: 1,
    message: 'Permission denied'
};
export function useCurrentPosition() {
    const appContext = useAppContext();
    return function getCurrentPosition(map?: L.Map): Promise<{ position?: GeolocationPosition, error?: GeolocationPositionError }> {
        return new Promise(resolve => {
            navigator.permissions.query({name: "geolocation"}).then(({state}) => {
                if (state === 'denied') {
                    resolve({error: PERMISSION_DENIED});
                }
                if (state === 'granted') {
                    navigator.geolocation.getCurrentPosition((position) => {
                        if (map) {
                            map.flyTo({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }, 18);
                        }
                        resolve({position});
                    }, (error) => {
                        resolve({error})
                    });
                }
                if (state === 'prompt') {
                    appContext.showModal(closePanel => {
                        return <div style={{
                            backgroundColor: white,
                            margin: 20,
                            borderRadius: 10,
                            padding: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 3px 5px -3px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{fontSize: 20, marginBottom: 10}}>Asking authorization to access your current location.</div>
                            <div style={{lineHeight: 1.5, marginBottom: 20}}>This application would like to request permission to use
                                your current location in order to provide you with a more pleasant experience when it comes to filling
                                out the information for your delivery address.
                            </div>
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button title={'OK'} icon={MdOutlineLocationOn} style={{border: 'none'}} theme={ButtonTheme.danger} onTap={() => closePanel(true)}/>
                                <Button title={'NO'} icon={MdOutlineCancel} style={{border: 'none'}} theme={ButtonTheme.subtle} onTap={() => closePanel(false)}/>
                            </div>
                        </div>
                    }).then(isOk => {
                        if(!isOk){
                            resolve({error: PERMISSION_DENIED});
                            return;
                        }
                        navigator.geolocation.getCurrentPosition((position) => {
                            if (map) {
                                map.flyTo({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                }, 18);
                            }
                            resolve({position});
                        }, (error) => {
                            resolve({error})
                        });
                    });
                }
            })
        });
    }
}