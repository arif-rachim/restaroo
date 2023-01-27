import {DButton} from "./DButton";
import {ButtonTheme, Card, CardTitle, useAppStore} from "@restaroo/lib";
import {IoClose} from "react-icons/io5";
import {AppState} from "../index";

export function ConfigurationForGridPanel(props:{closePanel:(param:any) => void,collectionOrConfigId:string}){
    const store = useAppStore<AppState>();
    const {closePanel} = props;
    return <Card style={{display:'flex',flexDirection:'column',backgroundColor:'white',height:'100%',borderTopRightRadius:0,borderBottomRightRadius:0}}>
        <CardTitle title={'Hello World'}/>
        <div style={{display:'flex',flexDirection:'column',padding:10}}>
            <DButton onTap={() => {
                closePanel(false);
            }} title={'Close Icon'} icon={IoClose} theme={ButtonTheme.normal} />



        </div>

    </Card>
}