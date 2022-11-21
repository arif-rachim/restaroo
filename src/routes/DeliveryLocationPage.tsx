import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {useEffect, useId, useRef, useState} from "react";
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import {useAppContext} from "../components/useAppContext";
import invariant from "tiny-invariant";
import {useFocusListener} from "../components/RouterPageContainer";
import {RouteProps} from "../components/useRoute";
import {blue, ButtonTheme, white} from "./Theme";
import {Button} from "../components/page-components/Button";
import {MdOutlineCancel, MdOutlineLocationOn} from "react-icons/md";
import {isNullOrUndefined} from "../components/page-components/utils/isNullOrUndefined";
import {IoLocation} from "react-icons/io5";
import {motion} from "framer-motion";

export function DeliveryLocationPage(props:RouteProps) {

    const id = useId();
    const {appDimension,showModal} = useAppContext();
    const [geolocationPosition,setGeoLocationPosition] = useState<GeolocationPosition|undefined>();
    const mapRefs = useRef<L.Map>();

    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl : markerIcon2x,
            iconUrl : markerIcon ,
            shadowUrl : markerShadow
        })
        const div = document.getElementById(`${id}-map`);
        invariant(div);
        div.innerHTML = `<div id="${id}-content" style="height:100%;width:100%;display: flex;flex-direction: column;z-index: 0"/>`;
        const map = L.map(`${id}-content`).setView({lat:25.2048,lng:55.2708}, 12);
        map.addEventListener('dragend',() => {
            console.log('DRAG END ',map.getCenter())
            const popup = document.getElementById(`${id}-popup`);
            if(popup){
                popup.style.opacity = '1';
            }
        })
        map.addEventListener('move',() =>{
            const popup = document.getElementById(`${id}-popup`);
            if(popup){
                popup.style.opacity = '0';
            }
        });
        map.addEventListener('moveend',() => {
            console.log('DRAG END ',map.getCenter())
            const popup = document.getElementById(`${id}-popup`);
            if(popup){
                popup.style.opacity = '1';
            }
        })

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        mapRefs.current = map;

        return () => {
            map.remove();
            div.innerHTML = '';
        }
    },[id]);

    useFocusListener(props.path,async (isFocus) => {
        if(isFocus && isNullOrUndefined(geolocationPosition)){
            const result = await showModal(closePanel => {
                return <div style={{backgroundColor:white,margin:20,borderRadius:10,padding:10,display:'flex',flexDirection:'column',boxShadow:'0 3px 5px -3px rgba(0,0,0,0.5)'}}>
                    <div style={{lineHeight:1.5}}>This application would like to request permission to use your current location in order to provide you with a more pleasant experience when it comes to filling out the information for your delivery address. If you are comfortable with us using your location, please click the "ok" button; otherwise, click the "no" button. (you are free to alter these settings at a later time).</div>
                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                        <Button title={'OK'} icon={MdOutlineLocationOn} style={{border:'none'}} theme={ButtonTheme.danger} onTap={async () => {
                            navigator.geolocation.getCurrentPosition((position) => {
                                invariant(mapRefs.current);
                                mapRefs.current?.flyTo({lat:position.coords.latitude,lng:position.coords.longitude},18);
                                setGeoLocationPosition(position);
                            }, (error) => {
                                alert(error.message);
                            });
                            closePanel(true)
                        }}/>
                        <Button title={'NO'} icon={MdOutlineCancel} style={{border:'none'}} theme={ButtonTheme.subtle} onTap={() => {
                            closePanel(false)
                        }}/>
                    </div>
                </div>
            });
        }
    })
    return <Page>
        <Header title={'Choose delivery location'} />
        <div style={{height:'100%',width:appDimension.width,display:'flex',flexDirection:'column',position:'relative'}}>
            <div id={`${id}-map`} style={{height:'100%',width:appDimension.width,display:'flex',flexDirection:'column'}}/>
            {geolocationPosition !== undefined &&
                <motion.div style={{
                    width: 40,
                    height: 40,
                    position: 'absolute',
                    left: (appDimension.width / 2) - 20,
                    top: ((appDimension.height - 37.5) / 2) - 40,
                }} initial={{y:-100}} animate={{y:0}} transition={{duration:2}}>
                    <IoLocation style={{fontSize: 40, color: blue}}/>
                    <div style={{position:'absolute',backgroundColor:'#333',color:'white',width:220,fontSize:13,left:-90,top:-60,padding:10,boxSizing:'border-box',display:'flex',
                        flexDirection:'column',alignItems:'center',borderRadius:10,transition:'opacity 100ms ease-in-out'
                    }} id={`${id}-popup`}>
                        <div style={{marginBottom:5}}>Your order will be delivered here</div>
                        <div style={{fontSize:11}}>Move pin to your exact location</div>
                    </div>
                </motion.div>
            }
        </div>
    </Page>
}