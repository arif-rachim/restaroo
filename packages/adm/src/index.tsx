import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Routes, useAppContext} from "@restaroo/lib";
import Home from "./routes/Home";
import {secured} from "./components/secured";
import {CollectionRoute} from "./routes/CollectionRoute";
import PocketBase from "pocketbase";
import {createFetch} from "@restaroo/lib";


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

const pb = new PocketBase(process.env.REACT_APP_API_URL ?? '')

root.render(<MyApp
    pocketBase={pb}
    fetchService={createFetch(process.env.REACT_APP_API_URL ?? '')}
    stateInitValue={{user: GuestProfile, addresses: []}}
    onProfileChange={(next, prev, store) => {
    }}
    mobileOnly={false}
    routes={routes}
/>);
