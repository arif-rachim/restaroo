import {motion, MotionProps} from "framer-motion";
import {ImgHTMLAttributes, PropsWithoutRef, useEffect, useState} from "react";
import {SkeletonBox} from "../page";
import noNull from "../utils/noNull";

export function Image(props: PropsWithoutRef<ImgHTMLAttributes<HTMLImageElement>> & MotionProps) {
    let {onLoad, onError, style, width, height, src, ...properties} = props;
    const [imageObjectURL, setImageObjectURL] = useState('');

    useEffect(() => {
        setImageObjectURL('');
        (async () => {
            const response = await fetch(noNull(src, ''));
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setImageObjectURL(imageObjectURL);
        })();
    }, [src]);

    return <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <SkeletonBox skeletonVisible={imageObjectURL === ''} style={{...style, width: width, height: height}}>
            <motion.img initial={{
                scale: 0.8
            }} animate={{scale: 1}} src={imageObjectURL} {...properties} width={width} height={height}
                        style={{...style}}/>
        </SkeletonBox>
    </div>
}