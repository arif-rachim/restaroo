import {RouteProps} from "../components/useRoute";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";
import {MdNavigation} from "react-icons/md";
import {useNavigate} from "../components/useNavigate";

export function LandingPage(props:RouteProps){
    const navigate = useNavigate();
    return <div>
        Hello World
        <Button title={'Navigate here'} onTap={() => {
            navigate('/home');
        }} theme={ButtonTheme.promoted} icon={MdNavigation}/>
    </div>
}