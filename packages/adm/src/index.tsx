import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Routes} from "@restaroo/lib";

import {pocketBase} from "./service";
import Home from "./routes/Home";
import {Collection} from "./routes/Collection";
import "antd/dist/reset.css";
import {secured} from "./component/SecuredPage";
import {Header} from "./component/Header";

interface AppState extends BaseState {
}

const MyApp = createApp<AppState>();

const routes: Routes = {
    '': {
        component: Home,
        initial: 'top',
        headerComponent : Header
    },
    'collection/$collection' : {
        component : secured(Collection),
        initial : 'right',
        headerComponent : Header
    }
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
