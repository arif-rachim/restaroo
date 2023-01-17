import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Routes} from "@restaroo/lib";
import {pocketBase} from "./service";
import Home from "./routes/Home";
import "antd/dist/reset.css";
import {secured} from "./components/secured";
import {CollectionRoute} from "./routes/CollectionRoute";

interface AppState extends BaseState {
}

const MyApp = createApp<AppState>();

const routes: Routes = {
    '': {
        component: secured(Home),
        initial: 'left'
    },
    'collection/$collection' : {
        component : CollectionRoute,
        initial : 'right'
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
