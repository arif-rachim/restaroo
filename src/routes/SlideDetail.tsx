import {motion} from "framer-motion";
import {MdCancel} from "react-icons/md";
import {CSSProperties, PropsWithChildren} from "react";
import {useAppContext} from "../components/useAppContext";

export function SlideDetail(props: PropsWithChildren<{ closePanel: (result: any) => void,style?:CSSProperties }>) {
    const {appDimension} = useAppContext();
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 10,
        maxHeight:appDimension.height - 70,
        ...props.style
    }}>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: -60, paddingBottom: 20}}>
            <motion.div onTap={() => {
                props.closePanel(false)
            }} whileTap={{scale: 0.95}}>
                <MdCancel fontSize={40} style={{color: "white"}}/>
            </motion.div>
        </div>
        {props.children}
    </div>


}