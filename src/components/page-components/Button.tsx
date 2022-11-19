import {IconType} from "react-icons";
import {ButtonTheme, theme, white} from "../../routes/Theme";
import {motion, MotionStyle} from "framer-motion";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

export function Button(props: { onTap: () => void, title: string, icon: IconType, theme: ButtonTheme, style?: MotionStyle, isBusy?: boolean }) {
    const isBusy = props.isBusy;
    const Icon: IconType = isBusy ? AiOutlineLoading3Quarters : props.icon;
    const buttonTheme = props.theme ?? ButtonTheme.danger;
    return <motion.button layout style={{
        minWidth: 0,
        fontSize: 18,
        borderColor :theme[buttonTheme],
        borderWidth : 1,
        borderStyle : 'solid',
        borderRadius: 5,
        padding: '10px 20px',
        color: theme[buttonTheme],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:'unset',
        ...props.style
    }} disabled={isBusy}
                          whileTap={{scale: 0.98}}
                          onTap={isBusy ? nothing : props.onTap}>
        <div>{props.title}</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: isBusy ? 20 : 10}}>
            {Icon &&
                <motion.div style={{width: 20, height: 20}}
                            animate={isBusy ? {rotate: [360, 0], position: 'fixed'} : undefined}
                            transition={isBusy ? {repeat: Infinity} : undefined}>
                    <Icon/>
                </motion.div>
            }
        </div>
    </motion.button>;
}

const nothing = () => {
};