import {CSSProperties, PropsWithChildren} from "react";
import {motion} from "framer-motion";

const defaultStyle = {
    minWidth: 20,
    minHeight: 19,
    background: 'linear-gradient(-90deg, rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.2))',
    backgroundSize: '500% 500%',
    borderRadius: 5,
    WebkitAnimation: 'gradient 1s ease infinite',
    MozAnimation: 'gradient 1s ease infinite',
    animation: 'gradient 1s ease infinite'
}

export function SkeletonBox(props: PropsWithChildren<{ skeletonVisible: boolean, style: CSSProperties }>) {
    const {children, skeletonVisible, style} = props;

    if (skeletonVisible) {
        return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className={'skeleton-box'}
                           style={{...defaultStyle, ...style}}/>
    }
    return <>{children}</>;
}