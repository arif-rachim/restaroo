import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Routes} from "@restaroo/lib";

import {pocketBase} from "./service";
import Home from "./routes/Home";
import {Collection} from "./routes/Collection";
import {LoginOrSignup} from "./routes/LoginOrSignup";
import {OtpPage} from "./routes/OtpPage";

interface AppState extends BaseState {
}

const MyApp = createApp<AppState>();

const routes: Routes = {
    '': {
        component: Home,
        initial: 'top',
    },
    'collection/$collection' : {
        component : Collection,
        initial : 'right'
    },
    'login': {
        component: LoginOrSignup,
        initial: "bottom"
    },
    'otp/$phoneNo': {
        component: OtpPage,
        initial: 'right'
    },
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<MyApp
    pocketBase={pocketBase}
    stateInitValue={{user: GuestProfile, addresses: []}}
    onProfileChange={(next, prev, store) => {
    }}
    mobileOnly={false}
    routes={routes}
/>);
