import {RouteProps, Routes, useRoute} from "./useRoute";
import {createContext, FunctionComponent, memo, useContext, useMemo, useRef} from "react";
import {motion, Variants} from "framer-motion";
import {createStoreInitValue, isFunction, isPromise, Store, useAfterInit, useStore, useStoreListener} from "../utils";

const variants: Variants = {
    left: {
        top: 0,
        left: '-100%',
        transition: {
            bounce: 0,
        }
    },
    right: {
        top: 0,
        left: '100%',
        transition: {
            bounce: 0,
        }
    },
    top: {
        top: '-100%',
        left: 0,
        transition: {
            bounce: 0,
        }
    },
    bottom: {
        top: '100%',
        left: 0,
        transition: {
            bounce: 0,
        }
    },
    center: {
        top: 0,
        left: 0,
        transition: {
            bounce: 0,
        }
    }
}

/**
 * Router Page Container
 * @constructor
 */
export function RouterPageContainer(props: { routes: Routes }) {
    const componentsRef = useRef<PathAbleComponent[]>([]);

    const {
        params,
        routeComponent: RouteComponent,
        path,
        initial,
        routeFooterComponent: RouteFooterComponent,
        routeHeaderComponent: RouterHeaderComponent
    } = useRoute(props.routes);

    const pathStore = useStore(path);
    useAfterInit(() => pathStore.setState(path), [path])

    const Component = useMemo(() => memo(function RouteComponentContainer(props: { isFocused: boolean } & RouteProps) {
        const {isFocused} = props;
        return <motion.div
            initial={initial}
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                overflow: 'auto',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column'
            }}
            animate={isFocused ? 'center' : initial}
            variants={variants}
        >
            <RouteComponent params={props.params} path={props.path}/>
        </motion.div>
        // eslint-disable-next-line
    }, (old, next) => old.isFocused === next.isFocused), [RouteComponent]);

    const componentIndex = componentsRef.current.findIndex(c => c.path === path);
    if (componentIndex < 0) {
        componentsRef.current.push({params, path, component: Component})
    } else {
        componentsRef.current[componentIndex].params = params;
    }
    return <CurrentActivePathContext.Provider value={pathStore}>
        <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {componentsRef.current.map((c) => {
                const Component = c.component;
                const isFocused = c.path === path;
                return <Component key={c.path} params={c.params} path={c.path} isFocused={isFocused}/>
            })}

            <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <RouteFooterComponent path={path} params={params}/>
            </div>

            <div style={{position: 'absolute', top: 0, width: '100%'}}>
                <RouterHeaderComponent path={path} params={params}/>
            </div>
        </div>

    </CurrentActivePathContext.Provider>
}

interface PathAbleComponent {
    component: FunctionComponent<{ isFocused: boolean } & RouteProps>,
    path: string,
    params: Map<string, string>
}

const CurrentActivePathContext = createContext<Store<string>>(createStoreInitValue(''));
type nothing = () => void;

export function useFocusListener(path: string, callback: () => (Promise<nothing | void> | nothing | void)) {
    const currentStorePath = useContext(CurrentActivePathContext);
    const lastFocusStateRef = useRef(false);
    const lastFocusResultCallback = useRef<(Promise<nothing | void> | nothing | void)>();
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    useStoreListener(currentStorePath, currentPath => currentPath, (next, prev) => {
        const isFocused = next === path;
        if (lastFocusStateRef.current !== isFocused) {
            if (isFocused) {
                lastFocusResultCallback.current = callbackRef.current();
            } else {
                if (isFunction(lastFocusResultCallback.current)) {
                    (lastFocusResultCallback.current as nothing)();
                    lastFocusResultCallback.current = undefined;
                }
                if (isPromise(lastFocusResultCallback.current)) {
                    (lastFocusResultCallback.current as Promise<nothing | void>).then(result => {
                        if (isFunction(result)) {
                            (result as nothing)();
                            lastFocusResultCallback.current = undefined;
                        }
                    });
                }
            }
            lastFocusStateRef.current = isFocused;
        }
    }, []);
}

export function useFocusListenerAfterInit(path: string, callback: () => (Promise<nothing | void> | nothing | void)) {
    const readyRef = useRef(false);
    return useFocusListener(path, () => {
        if (readyRef.current === false) {
            readyRef.current = true;
            return;
        }
        return callback();
    });
}


