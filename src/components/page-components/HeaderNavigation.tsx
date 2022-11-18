import {Image} from "./Image";
import {MdPlace} from "react-icons/md";
import {CgProfile} from "react-icons/cg";
import {useAppContext} from "../useAppContext";
import {IoChevronDown} from "react-icons/io5";
export function HeaderNavigation(){
    const {appDimension} = useAppContext();
    return <div style={{display:'flex',overflow:'auto',flexWrap:'nowrap',boxSizing:'border-box',width:appDimension.width,padding:5}}>
        <div style={{fontSize:30,marginRight:5}}>
            <MdPlace/>
        </div>
        <div style={{display:'flex',flexDirection:'column',overflow:'auto',width:'100%'}}>
            <div style={{display:'flex',alignItems:'flex-end'}}>
                <div style={{fontWeight:'bold',fontSize:16,marginBottom:3}}>Home</div>
                <div style={{marginLeft:3,marginBottom:2}}>
                    <IoChevronDown/>
                </div>
            </div>

            <div style={{textOverflow:'ellipsis',width:'100%',whiteSpace:'nowrap',overflow:'hidden'}}>Marina Diamond 5, Flat 806, Dubai Marina, Dubai Marina</div>
        </div>
        <div style={{fontSize:35,width:35,flexShrink:0,marginLeft:5}}>
            <CgProfile/>
        </div>
    </div>
}