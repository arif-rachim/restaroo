import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";



export function DeliveryPage(props:RouteProps) {
    useFocusListener(props.path,(isFocus) => {
        if(isFocus){
            adjustThemeColor('#FFF');
        }
    });
    return <Page>
        <div style={{fontSize: 20, fontWeight: 'bold'}}>
            {'This is delivery Page'}
        </div>
    </Page>
}