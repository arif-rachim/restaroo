import {motion} from "framer-motion";
import {useProfile} from "./useProfile";
import {MouseEvent} from "react";
import {Image} from "../../components/image/Image";
import {IoPersonCircleOutline} from "react-icons/io5";
import {pageColor} from "../../components/Theme";

export function AvatarImage(props: { width: number, height: number, onClick: (event?: MouseEvent<HTMLDivElement>) => void }) {
    const user = useProfile();

    return <motion.div style={{
        width: props.width,
        height: props.height,
        backgroundColor: pageColor,
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: props.width,
        overflow: 'hidden',
        flexShrink: 0
    }} whileTap={{scale: 0.9}} onClick={(event) => props.onClick(event)}>
        <Image width={props.width} height={props.height}
               alt={user.id}
               src={`http://127.0.0.1:8090/api/files/users/${user.id}/${user.avatar}?thumb=${props.width}x${props.height}`}
               errorIcon={IoPersonCircleOutline}
        />
    </motion.div>
}