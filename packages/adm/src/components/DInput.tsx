import {Input, InputProps, InputStyle} from "@restaroo/lib";
import {CSSProperties} from "react";

export function DInput(props: InputProps) {
    const titleIsLeft = props.titlePosition === 'left';
    const {style: propStyle, ...p} = props;
    let style: InputStyle = propStyle ?? {errorStyle: {}, containerStyle: {}, titleStyle: {}, inputStyle: {}};
    const inputStyle: CSSProperties = {fontSize: 14, textTransform: 'uppercase', ...style.inputStyle};
    const titleStyle: CSSProperties = {
        fontSize: 12,
        marginBottom: 3,
        marginTop: titleIsLeft ? 10 : 0, ...style.titleStyle
    };
    const containerStyle: CSSProperties = {borderBottom: 'unset', ...style.containerStyle}
    const errorStyle: CSSProperties = {height: 15, ...style.errorStyle}

    return <Input style={{inputStyle, titleStyle, containerStyle, errorStyle}} {...p}/>
}