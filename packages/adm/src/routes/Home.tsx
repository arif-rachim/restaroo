import {ButtonTheme, Card, CardTitle, Image, RouteProps, useLogout, useNavigate, useProfile,} from "@restaroo/lib";
import {motion} from "framer-motion";
import {DButton} from "../components/DButton";
import {IoLogOut} from "react-icons/io5";
import {pocketBase} from "../service";

interface Modules {
    [key: string]: {
        route: string,
        icon: string
    }
}

const modules: Modules = {
    'Product': {
        route: 'product',
        icon: 'menu-management-icon.svg'
    },
    'Users': {
        route: 'user',
        icon: 'user-management-icon.svg'
    },
    'Orders': {
        route: 'order',
        icon: 'order-management-icon.svg'
    },
};

export default function Home(props: RouteProps) {
    const profile = useProfile();
    const navigate = useNavigate();
    const logout = useLogout(pocketBase);
    return <div style={{
        width: '100%',
        position: 'relative',
        backgroundColor: '#F2f2f2',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <div style={{display: 'flex'}}>{
            Object.keys(modules).map((key: string) => {
                const {route, icon} = modules[key] as any;
                return <motion.div key={key} whileTap={{scale: 0.98}} whileHover={{scale: 1.02}} onTap={() => {
                    navigate(route);
                }}>
                    <Card style={{padding: 0, margin: 10}}>
                        <CardTitle title={key}/>
                        <Image src={`/images/${icon}`} width={100} height={100} style={{margin: '0px 20px 10px 20px'}}/>
                    </Card></motion.div>
            })
        }</div>
        <div style={{position: 'absolute', top: 15, right: 20, display: 'flex', alignItems: 'flex-end'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <div style={{
                    padding: '0px 5px 0px 5px',
                    marginRight: 10,
                    fontWeight: 300,
                    fontSize: 18,
                    marginBottom: 5
                }}>{profile.name}</div>
                <div style={{
                    padding: '0px 5px 0px 5px',
                    marginRight: 10,
                    fontWeight: 600,
                    fontSize: 10
                }}>{profile.username}</div>
            </div>
            <DButton title={'Logout'} style={{padding: '0px 10px 0px 10px'}} onTap={() => {
                logout();
            }} icon={IoLogOut} theme={ButtonTheme.danger}></DButton>
        </div>
    </div>
}
