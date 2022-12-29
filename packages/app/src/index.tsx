import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createApp, GuestProfile} from "@restaroo/lib";
import {LandingPage} from "./routes/LandingPage";
import {DeliveryPage} from "./routes/DeliveryPage";
import {DiningPage} from "./routes/DiningPage";
import {ReservationPage} from "./routes/ReservationPage";
import {AccountPage} from "./routes/AccountPage";
import {LoginOrSignup} from "./routes/LoginOrSignup";
import {OtpPage} from "./routes/OtpPage";
import {ProfilePage} from "./routes/ProfilePage";
import {AddressBookPage} from "./routes/AddressBookPage";
import {DeliveryLocationPage} from "./routes/DeliveryLocationPage";
import {HomePage} from "./routes/HomePage";
import OrderDetailPage from "./routes/OrderDetailPage";
import {PaymentMethodPage} from "./routes/PaymentMethodPage";
import CameraPage from "./routes/CameraPage";
import {AppState} from "./component/AppState";
import {pocketBase} from "./service";
import {FooterNavigation} from "./component/FooterNavigation";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const MyApp = createApp<AppState>({
    '': {
        component: LandingPage,
        initial: 'bottom'
    },
    'delivery': {
        component: DeliveryPage,
        footerComponent: FooterNavigation,
        initial: 'left',
    }
    ,
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
    'profile': {
        component: ProfilePage,
        initial: 'right'
    },
    'address-book': {
        component: AddressBookPage,
        initial: 'right'
    },
    'delivery-location/$addressId': {
        component: DeliveryLocationPage,
        initial: 'right'
    },
    'home': {
        component: HomePage,
        initial: 'right'
    },
    'order-detail': {
        component: OrderDetailPage,
        initial: 'right'
    },
    'payment-method': {
        component: PaymentMethodPage,
        initial: 'right'
    },
    'camera': {
        component: CameraPage,
        initial: 'right'
    }
})


root.render(<MyApp mobileOnly={true} stateInitValue={{
    user: GuestProfile,
    addresses: [],
    shoppingCart: []
}} onProfileChange={(next, prev, store) => {
    store.setState(currentState => {
        return {...currentState, shoppingCart: []};
    })
    // here we can perform fetching other stuff here !
}} pocketBase={pocketBase}/>);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// nonull send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
