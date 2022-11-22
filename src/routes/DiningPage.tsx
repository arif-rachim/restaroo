import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {Ri24HoursLine} from "react-icons/ri";

export function DiningPage(props: RouteProps) {
    useFocusListener(props.path, () => {
        adjustThemeColor('#FFF');
    });
    return <Page>
        <div style={{padding:'0px 20px',marginTop:40}}>
            <Ri24HoursLine fontSize={50}/>
        </div>
        <div style={{fontSize: 20, padding:20}}>
            {'We are putting in a lot of effort to make sure everything is just right for you.'}
        </div>

    </Page>
}