import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";

export function DiningPage(props: RouteProps) {
    useFocusListener(props.path, () => {
        adjustThemeColor('#FFF');
    });
    return <Page>
        <div style={{fontSize: 20, fontWeight: 'bold'}}>
            {'This is dining Page'}
        </div>

    </Page>
}