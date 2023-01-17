import {IconType} from "react-icons";
import {ButtonTheme, theme} from "../Theme";
import {motion, MotionStyle} from "framer-motion";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {CSSProperties} from "react";
import noNull from "../utils/noNull";

export interface ButtonProps {
    onTap: () => void,
    title: string | JSX.Element,
    icon: IconType,
    theme: ButtonTheme,
    style?: MotionStyle,
    iconStyle?: CSSProperties,
    isBusy?: boolean,
    disabled?: boolean
}

export function Button(props: ButtonProps) {
    const isBusy = props.isBusy;
    const disabled = props.disabled;
    const Icon: IconType = isBusy ? AiOutlineLoading3Quarters : props.icon;
    const buttonTheme = noNull(props.theme, ButtonTheme.danger);
    return <motion.button layout style={{
        minWidth: 0,
        fontSize: 18,
        borderColor: theme[buttonTheme],
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        padding: '10px 20px',
        color: theme[buttonTheme],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0)',
        ...props.style
    }} disabled={isBusy || disabled === true}
                          whileTap={{scale: 0.98}}
                          onTap={isBusy ? nothing : props.onTap}>
        <div>{props.title}</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: isBusy ? 20 : 10}}>
            {Icon &&
                <motion.div style={{width: 20, height: 20, ...props.iconStyle}}
                            animate={isBusy ? {rotate: [360, 0]} : undefined}
                            transition={isBusy ? {repeat: Infinity} : undefined}>
                    <Icon/>
                </motion.div>
            }
        </div>
    </motion.button>;
}

const nothing = () => {
};