import {GuestProfile, RouteProps, useProfile} from "@restaroo/lib";
import {FC, PropsWithChildren} from "react";
import {Input} from "antd";

export function secured(page:FC<RouteProps>){
    const Page = page;
    function SecuredPage(props:PropsWithChildren<RouteProps>){
        const profile = useProfile();
        const isNotLoggedIn = profile.id === GuestProfile.id;
        return <>
            {isNotLoggedIn && <LoginPanel params={props.params} path={props.path}/>}
            {!isNotLoggedIn && <Page params={props.params} path={props.path}/>}
        </>
    }

    return SecuredPage;
}


function LoginPanel(props:RouteProps){
    return <div>
        <Input title={'Phone no'} />
    </div>
}