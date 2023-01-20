import React from 'react';
import {render, screen} from '@testing-library/react';
import {createApp, createFetch, GuestProfile} from '@restaroo/lib';
import {AppState} from "./component/AppState";
import PocketBase from "pocketbase";


const App = createApp<AppState>();
test('renders learn react link', () => {
    render(<App mobileOnly={true} stateInitValue={{
        user: GuestProfile,
        addresses: [],
        shoppingCart: []
    }} onProfileChange={(next, prev, store) => {
    }} pocketBase={new PocketBase()} routes={{}} fetchService={createFetch('')}/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
