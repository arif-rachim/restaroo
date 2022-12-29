import React from 'react';
import {render, screen} from '@testing-library/react';
import {createApp, GuestProfile} from '@restaroo/lib';
import {AppState} from "./component/AppState";
import {pocketBase} from "./service";

const App = createApp<AppState>({});
test('renders learn react link', () => {
    render(<App mobileOnly={true} stateInitValue={{
        user: GuestProfile,
        addresses: [],
        shoppingCart: []
    }} onProfileChange={(next, prev, store) => {

    }} pocketBase={pocketBase}/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
