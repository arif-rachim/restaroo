import {GuestProfile, RouteProps, useProfile,useLogout} from "@restaroo/lib";
import {Avatar, Button, Drawer} from "antd";
import {CgProfile} from "react-icons/cg";
import {IoMenu} from "react-icons/io5";
import {motion} from "framer-motion";
import {useState} from "react";
import {pocketBase} from "../service";
export function Header(props:RouteProps){
    const profile = useProfile();
    const [open, setOpen] = useState(false);
    const isLoggedIn = profile.id !== GuestProfile.id && profile.id;
    const logout = useLogout(pocketBase);
    const showDrawer = () => {
        setOpen(true);
    };


    const onClose = () => {
        setOpen(false);
    };

    return <div style={{display:'flex',borderBottom:'1px solid rgba(0,0,0,0.1)',backgroundColor:'#F2F2F2'}}>
        <motion.div style={{padding:10}} whileHover={{scale:1.05}} whileTap={{scale:0.98}} onTap={showDrawer}>
            <IoMenu style={{fontSize:30}}/>
        </motion.div>
        <div style={{flexGrow:1}}></div>
        <div style={{display:'flex',alignItems:'center',padding:10}}>
            <div style={{marginRight:5  }}>{profile.name}</div>
            <Avatar size="default" icon={<CgProfile style={{fontSize:30}} />}   />
        </div>
        <Drawer title="Load information" placement="left" onClose={onClose} open={open}>
            {isLoggedIn &&
                <p><Button onClick={() => {
                    logout();
                }}>Logout</Button></p>
            }
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    </div>
}