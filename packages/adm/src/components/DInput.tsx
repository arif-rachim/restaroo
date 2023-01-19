import {Input, InputProps, InputStyle} from "@restaroo/lib";

export function DInput(props:InputProps){
    const titleIsLeft = props.titlePosition === 'left';
    const {style:propStyle,...p} = props;
    let style:InputStyle = propStyle ?? {errorStyle:{},containerStyle:{},titleStyle:{},inputStyle:{}};
    const inputStyle = {fontSize:14,...style.inputStyle};
    const titleStyle = {fontSize:12,marginBottom:3,marginTop:titleIsLeft?10:0,...style.titleStyle};
    const containerStyle = {borderBottom:'unset',...style.containerStyle}
    const errorStyle = {height:15,...style.errorStyle}

    return <Input style={{inputStyle,titleStyle,containerStyle,errorStyle}} {...p}/>
}