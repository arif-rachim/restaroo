import {CSSProperties, PropsWithChildren} from "react";

export function Page(props:PropsWithChildren<{style?:CSSProperties}>) {
    const style = props.style ?? {};
    return <div style={{
        paddingTop: 55,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: '100%',
        overflow: 'auto',
        ...style
    }}>
        {props.children}
    </div>;
}