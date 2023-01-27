import {FunctionComponent} from "react";
import {GuestProfile, RouteProps, useProfile} from "@restaroo/lib";
import {Login} from "./Login";

export function secured(component: FunctionComponent<RouteProps>) {
    const Component = component;

    function Secured(props: RouteProps) {
        const profile = useProfile();
        if (profile.id === GuestProfile.id) {
            return <Login/>
        }
        return <Component path={props.path} params={props.params}/>
    }

    return Secured;
}
