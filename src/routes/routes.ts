import {LandingPage} from "./LandingPage";
import {HeaderNavigation} from "../components/page-components/HeaderNavigation";
import {DeliveryPage} from "./DeliveryPage";
import {FooterNavigation} from "../components/page-components/FooterNavigation";
import {DiningPage} from "./DiningPage";
import {ReservationPage} from "./ReservationPage";
import {Routes} from "../components/useRoute";


export const routes:Routes = {
    '': {
        component: LandingPage,
        initial: 'bottom'
    },
    'delivery' : {
        component : DeliveryPage,
        footerComponent:FooterNavigation,
        initial:'left',
        headerComponent : HeaderNavigation
    },
    'dining' : {
        component : DiningPage,
        footerComponent:FooterNavigation,
        initial:'right',
        headerComponent : HeaderNavigation
    },
    'reservation' : {
        component : ReservationPage,
        footerComponent:FooterNavigation,
        initial:'right',
        headerComponent : HeaderNavigation
    }
}