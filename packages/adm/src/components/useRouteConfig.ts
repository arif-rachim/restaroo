import {RouteProps, Store, useAppContext, useAsyncEffect, useRouteProps, useStore} from "@restaroo/lib";
import {useCallback} from "react";



export interface RouteConfig<Config> {
    id: string,
    path: string,
    data: Config
}

function getPath(props: { route: RouteProps; ignoredParams: string[] }) {
    const path = Array.from(props.route.params.keys()).filter(s => {
        return !props.ignoredParams.includes(s);
    }).reduce((paths, key) => {
        const keyToReplace = `$${key}`;
        const indexToReplace = paths.findIndex(p => p === keyToReplace);
        if(indexToReplace >= 0){
            paths.splice(indexToReplace,1,props.route.params.get(key)??'')
        }
        return paths;
    }, props.route.path.split('/')).join('/');
    return path;
}

export function useRouteConfig<T>(props: { ignoredParams: string[],initialValue:T }):[Store<RouteConfig<T>>,() => Promise<void>] {
    const route = useRouteProps();
    const path = getPath({ignoredParams: props.ignoredParams, route});
    const {pb} = useAppContext();
    const routeConfigStore = useStore<RouteConfig<T>>({
        id: '',
        path: path,
        data: props.initialValue
    });

    const saveRouteConfig = useCallback(async function saveRouteConfig() {
        if (routeConfigStore.get().id.length > 0) {
            const result: any = await pb.collection('route_config').update(routeConfigStore.get().id, routeConfigStore.get());
            routeConfigStore.set(result);
        } else {
            const result: any = await pb.collection('route_config').create(routeConfigStore.get())
            routeConfigStore.set(result);
        }
    }, [routeConfigStore, pb]);

    useAsyncEffect(async () => {
        try {
            const path = getPath({ignoredParams: props.ignoredParams, route});
            const config: any = await pb.collection('route_config').getFirstListItem(`path="${path}"`);
            routeConfigStore.set(config);
        } catch (err) {
            console.log(err);
        }
    }, []);
    return [routeConfigStore,saveRouteConfig]
}