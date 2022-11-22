import {LandingPage} from "./LandingPage";
import {DeliveryPage} from "./DeliveryPage";
import {FooterNavigation} from "../components/page-components/FooterNavigation";
import {DiningPage} from "./DiningPage";
import {ReservationPage} from "./ReservationPage";
import {Routes} from "../components/useRoute";
import {AccountPage} from "./AccountPage";
import {LoginOrSignup} from "./LoginOrSignup";
import {OtpPage} from "./OtpPage";
import {ProfilePage} from "./ProfilePage";
import {AddressBookPage} from "./AddressBookPage";
import {DeliveryLocationPage} from "./DeliveryLocationPage";


export const routes: Routes = {
    '': {
        component: LandingPage,
        initial: 'bottom'
    },
    'delivery': {
        component: DeliveryPage,
        footerComponent: FooterNavigation,
        initial: 'left',
    },
    'dining': {
        component: DiningPage,
        footerComponent: FooterNavigation,
        initial: 'right',
    },
    'reservation': {
        component: ReservationPage,
        footerComponent: FooterNavigation,
        initial: 'right',
    },
    'account': {
        component: AccountPage,
        initial: 'right'
    },
    'login': {
        component: LoginOrSignup,
        initial: "bottom"
    },
    'otp/$phoneNo': {
        component: OtpPage,
        initial: 'right'
    },
    'profile/$profileId/$phoneNo': {
        component: ProfilePage,
        initial: 'right'
    },
    'address-book' : {
        component : AddressBookPage,
        initial : 'right'
    },
    'delivery-location' : {
        component : DeliveryLocationPage,
        initial : 'right'
    }
}