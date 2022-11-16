import {Routes} from "../components/useRoute";
import {FooterNavigation} from "../components/page-components/FooterNavigation";
import {LandingPage} from "./LandingPage";
import {HomePage} from "./HomePage";
import {HeaderNavigation} from "../components/page-components/HeaderNavigation";


export const routes: Routes = {
    '': {
        component: LandingPage,
        initial: 'left'
    },
    'home' : {
        component : HomePage,
        initial:'right',
        headerComponent : HeaderNavigation
    }
}