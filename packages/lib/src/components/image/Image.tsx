import {motion, MotionProps} from "framer-motion";
import {ImgHTMLAttributes, PropsWithoutRef, useEffect, useState} from "react";
import {SkeletonBox} from "../page";
import noNull from "../utils/noNull";
import {IconType} from "react-icons";
import {isNullOrUndefined, Visible} from "../utils";

export function Image(props: PropsWithoutRef<ImgHTMLAttributes<HTMLImageElement>> & MotionProps & { errorIcon?: IconType }) {
    let {onLoad, onError, style, width, height, src, errorIcon, ...properties} = props;
    const [imageObjectURL, setImageObjectURL] = useState('');
    const [fetchStatus, setFetchStatus] = useState<number | null>(null);
    useEffect(() => {
        setImageObjectURL('');
        (async () => {
            const response = await fetch(noNull(src, ''));
            if (response.status === 200) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImageObjectURL(imageObjectURL);
            }
            setFetchStatus(response.status);
        })();
    }, [src]);
    const isReadyOrNull = fetchStatus === null || fetchStatus === 200;
    const ErrorIcon: IconType | undefined = errorIcon;
    return <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <Visible if={isReadyOrNull}>
            <SkeletonBox skeletonVisible={fetchStatus === null} style={{...style, width: width, height: height}}>
                <motion.img initial={{
                    scale: 0.8
                }} animate={{scale: 1}} src={imageObjectURL} {...properties} width={width} height={height}
                            style={{...style}}/>
            </SkeletonBox>
        </Visible>
        <Visible if={!isReadyOrNull && !isNullOrUndefined(ErrorIcon)}>
            {ErrorIcon &&
                <ErrorIcon style={{width: props.width, height: props.height}}/>
            }
        </Visible>
    </div>
}