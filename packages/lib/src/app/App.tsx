import React, {useMemo} from 'react';
import AppShell from "./AppShell";
import {Routes} from "../components/route";
import {Store, WindowSizeContext} from "../components/utils";
import {BaseState} from "./BaseState";
import {Profile} from "./profile";
import PocketBase from "pocketbase";


interface AppProps<T> {
    mobileOnly: boolean,
    stateInitValue: T,
    onProfileChange: (next: Profile, prev: (Profile | undefined), store: Store<T>) => void,
    pocketBase: PocketBase,
    routes: Routes
}

type App<T extends BaseState> = (props: AppProps<T>) => JSX.Element;


export function createApp<T extends BaseState>(): App<T> {
    return Application<T>;
}

function Application<T extends BaseState>(props: AppProps<T>) {

    let {width, height} = useMemo(() => ({width: window.innerWidth, height: window.innerHeight}), []);

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
            justifyContent:'center',
            boxSizing: 'border-box'
        }}>


            <WindowSizeContext.Provider value={windowsSizeContextProviderValue}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height,
                    width,
                    flexShrink: 0,
                    borderRadius: 30,

                    overflow: 'auto',
                    boxShadow: '0 5px 5px 0 rgba(0,0,0,0.5)',
                    border: '10px solid rgba(0,0,0,1)',
                    transform: `scale(${scale})`
                }}>
                    <AppShell initValue={props.stateInitValue} onProfileChange={props.onProfileChange}
                              pocketBase={props.pocketBase} routes={props.routes}/>
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
                          pocketBase={props.pocketBase} routes={props.routes}/>
            </div>
        </WindowSizeContext.Provider>
    </div>
}

