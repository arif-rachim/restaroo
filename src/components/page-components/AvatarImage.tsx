import {motion} from "framer-motion";
import {useProfile} from "../../model/useProfile";
import {MouseEvent} from "react";

export function AvatarImage(props:{width:number,height:number,onClick:(event?: MouseEvent<HTMLDivElement>) => void}){
    const user = useProfile();

    return <motion.div style={{width: props.width, height: props.height, backgroundColor: '#CCC',border:'1px solid rgba(0,0,0,0.05)', borderRadius: props.width,overflow:'hidden',flexShrink:0}} whileTap={{scale:0.9}} onClick={(event) => props.onClick(event)}>
        <img src={`http://127.0.0.1:8090/api/files/users/${user.id}/${user.avatar}?thumb=${props.width}x${props.height}`} width={props.width} height={props.height}/>
    </motion.div>
}