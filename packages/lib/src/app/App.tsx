import React, {useMemo} from 'react';
import AppShell from "./AppShell";
import {registerRoute, Routes} from "../components/route";
import {Store, WindowSizeContext} from "../components/utils";
import {BaseState} from "./BaseState";
import {Profile} from "./profile";
import PocketBase from "pocketbase";


export function createApp<T extends BaseState>(routes: Routes) {
    registerRoute(routes);
    return App<T>;
}

function App<T extends BaseState>(props: { mobileOnly: boolean, stateInitValue: T, onProfileChange: (next: Profile, prev: (Profile | undefined), store: Store<T>) => void, pocketBase: PocketBase }) {

    let {width,height} = useMemo(() => ({width: window.innerWidth, height: window.innerHeight}), []);

    const isLargeScreen = width > 490;
    const {mobileOnly} = props;
    let scale = 1;
    if (mobileOnly && isLargeScreen) {
        width = 390;
        height = 844;
        scale = (window.innerHeight - 20) / height;
    }
    const windowsSizeContextProviderValue = useMemo(() => ({width, height}), [height, width]);
    if (mobileOnly && isLargeScreen) {
        return <div style={{
            display: 'flex',
            height: '100%',
            overflow: 'hidden',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center'}}>

            </div>

            <WindowSizeContext.Provider value={windowsSizeContextProviderValue}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height,
                    width,
                    flexShrink: 0,
                    borderRadius: 30,
                    marginRight: '5%',
                    overflow: 'auto',
                    boxShadow: '0 5px 5px 0 rgba(0,0,0,0.5)',
                    border: '10px solid rgba(0,0,0,1)',
                    transform: `scale(${scale})`
                }}>
                    <AppShell initValue={props.stateInitValue} onProfileChange={props.onProfileChange}
                              pocketBase={props.pocketBase}/>
                </div>
            </WindowSizeContext.Provider>
        </div>
    }

    return <div style={{display: 'flex', height: '100%', overflow: 'auto'}}>
        <WindowSizeContext.Provider value={windowsSizeContextProviderValue}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height,
                width,
                flexShrink: 0,
                overflow: 'auto',
                margin: 0,
                borderRadius: 0
            }}>
                <AppShell initValue={props.stateInitValue} onProfileChange={props.onProfileChange}
                          pocketBase={props.pocketBase}/>
            </div>
        </WindowSizeContext.Provider>
    </div>
}

