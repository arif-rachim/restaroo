import {useNavigate} from "../useNavigate";
import {useAppContext} from "../useAppContext";
import {motion} from "framer-motion";
import {yellow} from "../../routes/Theme";
import {RouteProps} from "../useRoute";
import {
    MdDeliveryDining,
    MdDining,
    MdOutlineAccessTime,
    MdOutlineAccessTimeFilled,
    MdOutlineDeliveryDining,
    MdOutlineDining
} from "react-icons/md";
import {IconType} from "react-icons";

function NavigationButton(props: { path: string, link: string, title: string, icon: IconType, iconSelected: IconType, width: string }) {
    const navigate = useNavigate();
    const {path, link, title, icon: Icon, iconSelected: IconSelected, width} = props;
    return <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                       style={{
                           position: 'relative',
                           alignItems: 'center',
                           display: 'flex',
                           flexDirection: 'column',
                           fontSize: 28,
                           color: path === 'cart' ? yellow : 'unset',
                           width: width,
                           flexShrink: 0,
                           flexGrow: 0
                       }}
                       onTap={() => {
                           navigate(link);
                       }}>
        {path === link ? <IconSelected/> : <Icon/>}
        <div style={{fontSize: 12}}>{title}</div>
    </motion.div>;
}

interface Menu {
    path: string,
    title: string,
    icon: IconType,
    iconSelected: IconType
}

const menus: Menu[] = [{
    path: 'delivery',
    title: 'Delivery',
    icon: MdOutlineDeliveryDining,
    iconSelected: MdDeliveryDining
},
    {
        path: 'dining',
        title: 'Dining',
        icon: MdOutlineDining,
        iconSelected: MdDining
    },
    {
        path: 'reservation',
        title: 'Reservation',
        icon: MdOutlineAccessTime,
        iconSelected: MdOutlineAccessTimeFilled
    }
];

export function FooterNavigation(props: RouteProps) {
    const navigate = useNavigate();
    const path = props.path;
    const {store, appDimension} = useAppContext();
    const width = (100 / menus.length).toFixed(2) + '%';
    const selectedIndex = menus.findIndex(m => m.path === path);
    return <motion.div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        width: appDimension.width,
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        backgroundColor:'white'
    }} initial={{y:100}} animate={{y:0}} exit={{y:100}}>
        <div style={{height:5,marginBottom:5,position:'relative'}}>
            <motion.div style={{width,background:'#333',borderBottomLeftRadius:5,borderBottomRightRadius:5,height:'100%',left:`calc(${width} * ${selectedIndex})`,position:'relative',transition:'left 200ms cubic-bezier(.49,.13,.21,.92)'}} />
        </div>
        <div style={{display: 'flex',padding:5,boxSizing:'border-box'}}>
            {menus.map(menu => {
                return <NavigationButton path={path} link={menu.path} title={menu.title}
                                         iconSelected={menu.iconSelected} icon={menu.icon} key={menu.path}
                                         width={width}/>
            })}
        </div>
    </motion.div>
}