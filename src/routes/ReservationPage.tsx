import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";
import {SiAwesomelists} from "react-icons/si";

export function ReservationPage(props: RouteProps) {
    useFocusListener(props.path, () => {
        adjustThemeColor('#FFF');
    });
    return <Page>
        <div style={{padding:'0px 20px',marginTop:40}}>
            <SiAwesomelists fontSize={50}/>
        </div>
        <div style={{fontSize: 20, padding:20}}>
            {'In the meantime, know that more awesome content is on the way to this page.'}
        </div>
    </Page>
}