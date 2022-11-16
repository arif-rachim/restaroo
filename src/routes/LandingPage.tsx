import {RouteProps} from "../components/useRoute";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";
import {MdNavigation} from "react-icons/md";
import {useNavigate} from "../components/useNavigate";
import restaroo from "../assets/restaroo.svg";
import {Image} from "../components/page-components/Image";

export function LandingPage(props: RouteProps) {
    const navigate = useNavigate();
    return <div style={{display:'flex',flexDirection:'column',padding : 10,justifyContent:'center',height:'100%'}}>
        <Image src={restaroo} height={300}/>
        <Button title={'Click Here'} onTap={() => {
            navigate('/home');
        }} theme={ButtonTheme.promoted} icon={MdNavigation}/>
    </div>
}