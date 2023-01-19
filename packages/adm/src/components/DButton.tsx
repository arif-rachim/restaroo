import {Button, ButtonProps} from "@restaroo/lib";

export function DButton(props:ButtonProps){
    const {style,iconStyle,...p} = props;
    return <Button style={{fontSize:13,padding:'5px 10px',...style}} iconStyle={{fontSize:20,...iconStyle}} {...p}/>
}