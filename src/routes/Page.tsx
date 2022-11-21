import {CSSProperties, PropsWithChildren, UIEventHandler} from "react";

export function Page(props: PropsWithChildren<{ style?: CSSProperties, onScroll?: UIEventHandler<HTMLDivElement> }>) {
    const style = props.style ?? {};
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: '100%',
        overflow: 'auto',
        ...style
    }} onScroll={props.onScroll}>
        {props.children}
    </div>;
}