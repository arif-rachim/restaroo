import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, GuestProfile, Routes} from "@restaroo/lib";
import Home from "./routes/Home";
import {secured} from "./components/secured";
import {CollectionRoute} from "./routes/CollectionRoute";
import PocketBase from "pocketbase";
import {createFetch} from "@restaroo/lib";
import {Table, tables} from "@restaroo/mdl";


export interface AppState extends BaseState {
    activateComponentEditor:boolean,
    locale:'ar-ae'|'en-us'|string,
    tables:Table[]
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
    stateInitValue={{user: GuestProfile, addresses: [],activateComponentEditor:false,locale:'en-us',tables:tables}}
    onProfileChange={(next, prev, store) => {
    }}
    mobileOnly={false}
    routes={routes}
/>);
