import {ChangeEventHandler, CSSProperties, FocusEventHandler, HTMLInputTypeAttribute, ReactElement} from "react";
import {ButtonTheme, theme} from "../Theme";
import {getProp, useIsMounted, usePreviousValue} from "../utils";

interface InputStyle {
    containerStyle?: CSSProperties,
    titleStyle?: CSSProperties,
    inputStyle?: CSSProperties,
    errorStyle?: CSSProperties
}

export interface InputProps {
    title: string | ReactElement,
    placeholder: string,
    value?: string,
    defaultValue?: string,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
    error?: string,
    style?: InputStyle,
    type?: HTMLInputTypeAttribute,
    disabled?: boolean,
    inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search",
    titlePosition?: 'top' | 'left',
    titleWidth?: number | string,
    onFocus?: FocusEventHandler<HTMLInputElement>,
    onBlur?: FocusEventHandler<HTMLInputElement>,
    readOnly?: boolean
}

export function Input(props: InputProps) {

    const {
        error,
        value,
        defaultValue,
        style,
        type,
        inputMode,
        titlePosition,
        titleWidth,
        onFocus,
        onBlur,
        onChange,
        title,
        readOnly
    } = props;
    if (value !== undefined && onChange === undefined && readOnly !== true) {
        console.log(`You probably wants to set '${title}' to readOnly mode since we have 'value' but there is no 'onChange' registered`);
    }
    const prevValue = usePreviousValue(value);
    const isMounted = useIsMounted();
    if (isMounted && prevValue === undefined && value !== undefined) {
        console.log(`Input '${title}' has changed from uncontrolled to controlled`);
    }
    if (prevValue !== undefined && value === undefined) {
        console.log(`Input '${title}' has changed from controlled to uncontrolled`);
    }
    const inlineTitle = titlePosition === 'left';
    return <label style={{
        display: 'flex',
        flexDirection: inlineTitle ? 'row' : 'column',
        padding: '5px 0px 0px 0px',
        position: 'relative',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        ...getProp(style, 'containerStyle')
    }}>
        <div style={{
            display: 'flex',
            paddingLeft: 10,
            fontWeight: 'bold',
            alignItems: 'center',
            width: inlineTitle ? titleWidth : 'unset',
            paddingBottom: inlineTitle ? 22 : 0,
            marginRight: inlineTitle ? 10 : 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            fontSize: inlineTitle ? 20 : 16, ...getProp(style, 'titleStyle')
        }}>{props.title}</div>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, boxSizing: 'border-box'}}>
            <input style={{
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: `1px solid ${error ? theme[ButtonTheme.danger] : 'rgba(0,0,0,0.01)'}`,
                padding: '5px 10px',
                borderRadius: 0,
                flexGrow: 1,
                fontSize: 20,
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                ...getProp(style, 'inputStyle')
            }} placeholder={props.placeholder} value={value} defaultValue={defaultValue} onChange={props.onChange}
                   title={error} type={type} inputMode={inputMode} onFocus={e => {
                if (onFocus) {
                    onFocus(e);
                }
            }}
                   disabled={props.disabled} readOnly={props.readOnly} onBlur={e => {
                if (onBlur) {
                    onBlur(e)
                }
            }}/>
            <div style={{
                paddingRight: 5,
                fontSize: 12,
                textAlign: 'right',
                color: theme[ButtonTheme.danger],
                height: 20,
                ...getProp(style, 'errorStyle')
            }}>{props.error}</div>
        </div>
    </label>;
}