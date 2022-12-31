import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Profile, Routes} from "@restaroo/lib";

import {pocketBase} from "./service";
import Home from "./routes/Home";

interface AppState extends BaseState{
}

const MyApp = createApp<AppState>();

const routes:Routes = {
    '':{
        component : Home,
        initial : 'top',
    }
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<MyApp
    pocketBase={pocketBase}
    stateInitValue={{user:GuestProfile,addresses:[]}}
    onProfileChange={(next, prev, store) => {}}
    mobileOnly={false}
    routes={routes}

/>);
