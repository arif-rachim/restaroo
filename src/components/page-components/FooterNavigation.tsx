import {useNavigate} from "../useNavigate";
import {useAppContext} from "../useAppContext";
import {motion} from "framer-motion";
import {yellow} from "../../routes/Theme";
import {RouteProps} from "../useRoute";
import {MdOutlineDeliveryDining,MdDeliveryDining,MdOutlineDining,MdDining,MdOutlineAccessTime,MdOutlineAccessTimeFilled} from "react-icons/md";

export function FooterNavigation(props: RouteProps) {
    const navigate = useNavigate();
    const path = props.path;
    const {store, appDimension} = useAppContext();

    return <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
        width: appDimension.width,
        boxSizing: 'border-box',
        padding: 5,
        borderTop: '1px solid rgba(0,0,0,0.05)',
    }}>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'home' ? yellow : 'unset'
                    }}
                    onTap={() => navigate('delivery')}>
            {path === 'delivery' ? <MdDeliveryDining/> : <MdOutlineDeliveryDining/>}
            <div style={{fontSize: 12}}>Delivery</div>
        </motion.div>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'categories' ? yellow : 'unset'
                    }}
                    onTap={() => navigate('dining')}>
            {path === 'dining' ? <MdDining/> : <MdOutlineDining/>}
            <div style={{fontSize: 12}}>Dining</div>
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'cart' ? yellow : 'unset'
                    }}
                    onTap={() => {
                        navigate('reservation');
                    }}>
            {path === 'reservation' ? <MdOutlineAccessTimeFilled/> : <MdOutlineAccessTime/>}
            <div style={{fontSize: 12}}>Reservation</div>
        </motion.div>

    </div>
}