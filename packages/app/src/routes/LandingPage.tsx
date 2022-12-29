import {Button, ButtonTheme, Image, RouteProps, useNavigate} from "@restaroo/lib";
import {MdRestaurant} from "react-icons/md";
import restaroo from "../assets/restaroo.svg";

export function LandingPage(props: RouteProps) {
    const navigate = useNavigate();
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'center',
        height: '100%',
        overflow: 'auto'
    }}>
        <Image src={restaroo} height={300}/>
        <Button title={'To know more, please click here'} onTap={() => {
            navigate('delivery');
        }} theme={ButtonTheme.promoted} icon={MdRestaurant}/>
    </div>
}