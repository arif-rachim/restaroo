import {CSSProperties} from "react";

export function Value(props: { value?: any,style?:CSSProperties }) {
    return <div style={props.style}>{props.value}</div>
}