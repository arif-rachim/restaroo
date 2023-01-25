import {DButton} from "./DButton";
import {ButtonTheme, Card, CardTitle} from "@restaroo/lib";
import {IoClose} from "react-icons/io5";

export function ConfigurationForGridPanel(props:{closePanel:(param:any) => void,}){
    const {closePanel} = props;
    return <Card style={{display:'flex',flexDirection:'column',backgroundColor:'white',height:'100%',borderTopRightRadius:0,borderBottomRightRadius:0}}>
        <CardTitle title={'Hello World'}/>
        <div style={{display:'flex',flexDirection:'column'}}>

        </div>
        <DButton onTap={() => {
            closePanel(false);
        }} title={'Close Icon'} icon={IoClose} theme={ButtonTheme.normal} />
    </Card>
}