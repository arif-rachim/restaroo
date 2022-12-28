import {useNavigate} from "../useNavigate";
import {useAppContext, useFooterVisible} from "../useAppContext";
import {motion} from "framer-motion";
import {red} from "../../routes/Theme";
import {RouteProps} from "../useRoute";
import {
    MdDeliveryDining,
    MdOutlineAccessTime,
    MdOutlineAccessTimeFilled,
    MdOutlineDeliveryDining,
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
                           width: width,
                           flexShrink: 0,
                           flexGrow: 0
                       }}
                       onTap={() => {
                           navigate(link);
                       }}>
        {path === link ? <IconSelected style={{color:red}}/> : <Icon/>}
        <div style={{fontSize: 12,color:path===link?red:'unset'}}>{title}</div>
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
    // {
    //     path: 'dining',
    //     title: 'Dining',
    //     icon: MdOutlineDining,
    //     iconSelected: MdDining
    // },
    {
        path: 'reservation',
        title: 'Reservation',
        icon: MdOutlineAccessTime,
        iconSelected: MdOutlineAccessTimeFilled
    }
];

export function FooterNavigation(props: RouteProps) {

    const path = props.path;
    const {appDimension} = useAppContext();
    const width = (100 / menus.length).toFixed(2) + '%';
    const selectedIndex = menus.findIndex(m => m.path === path);
    const visible = useFooterVisible();
    return <motion.div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        width: appDimension.width,
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        backdropFilter : 'blur(10px) contrast(60%)',
        WebkitBackdropFilter : 'blur(10px) contrast(60%)',
        background : 'rgba(255,255,255,0.8)'
    }} initial={{y: 100}} animate={{y: visible? 0:100}} exit={{y: 100}} transition={{bounce:0}}>
        <div style={{height: 5, marginBottom: 5, position: 'relative'}}>
            <motion.div style={{
                width,
                background: red,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                height: '100%',
                left: `calc(${width} * ${selectedIndex})`,
                position: 'relative',
                transition: 'left 200ms cubic-bezier(.49,.13,.21,.92)'
            }}/>
        </div>
        <div style={{display: 'flex', padding: 5, boxSizing: 'border-box'}}>
            {menus.map(menu => {
                return <NavigationButton path={path} link={menu.path} title={menu.title}
                                         iconSelected={menu.iconSelected} icon={menu.icon} key={menu.path}
                                         width={width}/>
            })}
        </div>
    </motion.div>
}