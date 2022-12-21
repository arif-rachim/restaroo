import {Page} from "./Page";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {useAppContext} from "../components/useAppContext";
import {useState} from "react";
import {Button} from "../components/page-components/Button";
import {IoCamera, IoClose, IoSaveOutline} from "react-icons/io5";
import {ButtonTheme} from "./Theme";
import {pocketBase} from "../components/pocketBase";
import {useProfile} from "../model/useProfile";
import {produce} from "immer";

function dataURItoBlob(dataURI:string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0){
        byteString = atob(dataURI.split(',')[1]);
    }else{
        byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

export default function CameraPage() {
    const {appDimension,store:appStore} = useAppContext();
    const [dataUri, setDataUri] = useState('');

    const user = useProfile();

    return <Page>
        {dataUri && <div style={{display:'flex',flexDirection:'column'}}>
            <img src={dataUri} height={appDimension.width} width={appDimension.width}/>
            <div style={{display:'flex',padding:10,justifyContent:'center'}}>
                <Button title={'Save'} icon={IoSaveOutline}  onTap={async () => {
                    const formData = new FormData();
                    let blob = dataURItoBlob(dataUri); //Converts to blob using link above
                    formData.append("avatar", blob);
                    const record = await pocketBase.collection('users').update(user.id, formData);
                    appStore.setState(produce(s => {
                        s.user.avatar = record.avatar;
                    }));
                    window.history.back();
                }} theme={ButtonTheme.danger} style={{padding:'15px 10px',marginRight:10}}/>
                <Button title={'Re-Take'} icon={IoCamera} onTap={() => {setDataUri('')}} theme={ButtonTheme.promoted} style={{padding:'15px 10px',marginRight:10}}/>
                <Button title={'Cancel'} icon={IoClose} onTap={() => {window.history.back()}} theme={ButtonTheme.promoted} style={{padding:'15px 10px'}}/>
            </div>
        </div>}
        {!dataUri &&
            <div style={{display: 'flex', flexDirection: 'column', position: 'relative',borderRadius:'50%',overflow:'hidden',width:appDimension.width,height:appDimension.width}}>
                <Camera
                    onTakePhoto={(dataUri) => setDataUri(dataUri)}
                    idealResolution={{width: appDimension.width, height: appDimension.width}}
                />

            </div>
        }
    </Page>
}
