import {useCallback} from "react";
import {routes} from "../routes/routes";

export type RoutePath = keyof typeof routes;

export function useNavigate() {
    return useCallback((path: RoutePath,params?:any) => {
        let stringPath = path as string;
        if(params){
            Object.keys(params).forEach(key => {
                stringPath = stringPath.replace('$'+key,params[key]);
            })
        }
        window.location.hash = '#' + stringPath;
    }, [])
}
