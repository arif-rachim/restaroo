import {RouteProps, useRoute} from "./useRoute";
import {createContext, FunctionComponent, useContext, useEffect, useMemo, useRef} from "react";
import {motion, Variants} from "framer-motion";
import {isFunction} from "./page-components/utils/isFunction";
import {isPromise} from "./page-components/utils/isPromise";


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
export function RouterPageContainer() {
    const componentsRef = useRef<PathAbleComponent[]>([]);
    const headerComponent = useRef<HTMLDivElement>(null);
    const footerComponent = useRef<HTMLDivElement>(null);

    const {
        params,
        routeComponent: RouteComponent,
        path,
        initial,
        routeFooterComponent: RouteFooterComponent,
        routeHeaderComponent: RouterHeaderComponent
    } = useRoute();

    const Component = useMemo(() => function RouteComponentContainer(props: { isFocused: boolean } & RouteProps) {
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
    }, [RouteComponent]);

    const componentIndex = componentsRef.current.findIndex(c => c.path === path);
    if (componentIndex < 0) {
        componentsRef.current.push({params, path, component: Component})
    } else {
        componentsRef.current[componentIndex].params = params;
    }


    return <CurrentActivePathContext.Provider value={path}>

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

            <div style={{position: 'absolute', bottom: 0, width: '100%'}} ref={footerComponent}>
                <RouteFooterComponent path={path} params={params}/>
            </div>

            <div style={{position: 'absolute', top: 0, width: '100%'}} ref={headerComponent}>
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

const CurrentActivePathContext = createContext('');
type nothing = () => void;
export function useFocusListener(path: string, callback: () => (Promise<nothing|void>|nothing|void) ) {
    const currentActivePath = useContext(CurrentActivePathContext);
    const isFocused = currentActivePath === path;
    useEffect(() => {
        let result:any;
        if(isFocused){
            result = callback();
        }
        return () => {
            if(isPromise(result)){
                result.then((callback:any) => {
                    if(isFunction(callback)){
                        callback();
                    }
                })
            }
            if(isFunction(result)){
                result();
            }
        }
        // eslint-disable-next-line
    }, [isFocused])

}



