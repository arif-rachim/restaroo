import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BaseState, createApp, createFetch, GuestProfile, Routes} from "@restaroo/lib";
import Home from "./routes/Home";
import {secured} from "./components/secured";
import {CollectionListRoute} from "./routes/CollectionListRoute";
import PocketBase from "pocketbase";
import {Table, tables} from "@restaroo/mdl";
import {CollectionItemRoute} from "./routes/CollectionItemRoute";


export interface AppState extends BaseState {
    activateComponentEditor: boolean,
    locale: 'ar-ae' | 'en-us' | string,
    tables: Table[]
}

const MyApp = createApp<AppState>();

const routes: Routes = {
    '': {
        component: secured(Home),
        initial: 'left'
    },
    'collection-list/$collection': {
        component: CollectionListRoute,
        initial: 'right'
    },
    'collection-item/$collection/$id': {
        component: CollectionItemRoute,
        initial: 'right'
    }
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const pb = new PocketBase(process.env.REACT_APP_API_URL ?? '')

root.render(<MyApp
    pocketBase={pb}
    fetchService={createFetch(process.env.REACT_APP_API_URL ?? '')}
    stateInitValue={{
        user: GuestProfile,
        addresses: [],
        activateComponentEditor: false,
        locale: 'en-us',
        tables: tables
    }}
    onProfileChange={(next, prev, store) => {
    }}
    mobileOnly={false}
    routes={routes}
/>);
