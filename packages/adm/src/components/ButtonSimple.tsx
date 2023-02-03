import {IconType} from "react-icons";
import {motion} from "framer-motion";
import {CSSProperties} from "react";

export function ButtonSimple(props: { title: string, icon: IconType, onClick: () => void, style?: CSSProperties }) {
    const {title, icon: Icon, onClick, style} = props;
    return <motion.div style={{
        display: 'flex',
        fontSize: 14,
        padding: '5px 10px',
        cursor: 'pointer',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: '#f2f2f2',
        boxShadow: '0 5px 5px -3px rgba(255,255,255,1) inset', ...style
    }} whileHover={{scale: 1.02}} whileTap={{scale: 0.98, boxShadow: '0 5px 5px -3px rgba(0,0,0,0.5) inset'}}
                       onClick={onClick}>
        {title && <div style={{marginRight:5}}>
            {title}
        </div>}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon style={{fontSize: 16}}/>
        </div>
    </motion.div>;
}