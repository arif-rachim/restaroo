import {RouteProps, Routes, useRoute} from "./useRoute";
import {
    createContext,
    CSSProperties,
    FunctionComponent,
    memo,
    PropsWithChildren,
    ReactElement,
    useContext,
    useMemo,
    useRef
} from "react";
import {AnimatePresence, motion, Variants} from "framer-motion";
import {
    createStoreInitValue,
    getProp,
    isFunction,
    isPromise,
    Store,
    useAfterInit,
    useStore,
    useStoreListener,
    useStoreValue
} from "../utils";
import invariant from "tiny-invariant";
import {FactoryFunctionConfig} from "../../app";
import {ErrorBoundary} from "../utils/ErrorBoundary";

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
export function RouterPageContainer(props: { routes: Routes, panelStore: Store<{ modalPanel: ReactElement | false, slidePanel: ({ id: string, element: ReactElement, config: FactoryFunctionConfig })[] }> }) {
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

    useAfterInit(() => pathStore.set(path), [path])

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
            <RoutePropsProvider params={props.params} path={props.path}>
                <RouteComponent params={props.params} path={props.path}/>
            </RoutePropsProvider>
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
            <RoutePropsProvider params={params} path={path}>
                <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                    <RouteFooterComponent path={path} params={params}/>
                </div>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <RouterHeaderComponent path={path} params={params}/>
                </div>
                <SlideAndModalPanel panelStore={props.panelStore}/>
            </RoutePropsProvider>
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
    useStoreListener(currentStorePath, currentPath => currentPath, (next) => {
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
        if (!readyRef.current) {
            readyRef.current = true;
            return;
        }
        return callback();
    });
}


const RoutePropsContext = createContext<RouteProps | undefined>(undefined);

const RoutePropsProvider = memo(function RoutePropsProvider(props: PropsWithChildren<RouteProps>) {
    const {children, ...routeProps} = props;
    return <RoutePropsContext.Provider value={routeProps}>{props.children}</RoutePropsContext.Provider>
},(prev,next) => {
    if(prev.path !== next.path){
        return false;
    }
    if(prev.params !== next.params){
        return false;
    }
    return true;
});

export function useRouteProps(): RouteProps {
    const context = useContext(RoutePropsContext);
    invariant(context);
    return context;
}


function SlideAndModalPanel(props: { panelStore: Store<{ modalPanel: ReactElement | false, slidePanel: ({ id: string, element: ReactElement, config: FactoryFunctionConfig })[] }> }) {
    const panelStore = props.panelStore;
    const {modalPanel, slidePanel} = useStoreValue(panelStore, param => param);
    return <ErrorBoundary><AnimatePresence>
        {renderSlidePanels({panels: slidePanel})}
        {modalPanel !== false && <Modal modalPanel={modalPanel} key={'modal-panel'}/>}
    </AnimatePresence></ErrorBoundary>
}

function Modal(props: { modalPanel?: ReactElement }) {

    return <motion.div style={modalStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                       exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                       key={'modal'}>
        <motion.div style={dialogPanelStyle} initial={{scale: 0.7, opacity: 0.4}}
                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.7, opacity: 0.4}}>
            {getProp(props, 'modalPanel')}
        </motion.div>
    </motion.div>;
}


function renderSlidePanels(props: { panels: { id: string, element: ReactElement, config: FactoryFunctionConfig }[] }) {
    const panels = props.panels;
    return panels.map((p, index, source) => {
        let initial: any = {bottom: '-100%', width: '100%'};
        let animate: any = {bottom: 0};
        let exit: any = {bottom: '-100%'};
        if (p.config.position === 'top') {
            initial = {top: '-100%', width: '100%'};
            animate = {top: 0};
            exit = {top: '-100%'};
        }
        if (p.config.position === 'right') {
            initial = {right: '-100%', height: '100%'};
            animate = {right: 0};
            exit = {right: '-100%'};
        }
        if (p.config.position === 'left') {
            initial = {left: '-100%', height: '100%'};
            animate = {left: 0};
            exit = {left: '-100%'};
        }
        const isLastIndex = index === source.length - 1;

        if (!isLastIndex) {
            const isNextPanelIsPopup = panels[index + 1].config.isPopup;
            if (!isNextPanelIsPopup) {
                animate = exit;
            }
        }
        return <motion.div style={slidePanelStyle}
                           key={p.id}>
            <OverlayPanel blurBackground={!p.config.isPopup}/>
            <motion.div style={{position: 'absolute'}} initial={initial}
                        animate={animate} exit={exit} transition={{bounce: 0}}>
                {p.element}
            </motion.div>
        </motion.div>
    })
}


const dialogPanelStyle: CSSProperties = {
    minWidth: 100,
    minHeight: 0,
}


const modalStyle: CSSProperties = {
    backdropFilter: 'blur(5px) contrast(60%)',
    WebkitBackdropFilter: 'blur(5px) contrast(60%)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
}

const slidePanelStyle: CSSProperties = {

    width: '100%',
    height: '100%',
    position: 'fixed',
    overflow: 'hidden',
    boxSizing: 'border-box'
}


function OverlayPanel(props: { blurBackground: boolean }) {

    return <motion.div style={props.blurBackground ? overlayStyle : overlayStyleNoBlur}
                       initial={{opacity: 0}}
                       animate={{opacity: 1}}
                       exit={{opacity: 0}}/>
}


const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(5px) contrast(60%)',
    WebkitBackdropFilter: 'blur(5px) contrast(60%)',
}

const overlayStyleNoBlur: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(0.1px) contrast(60%)',
    WebkitBackdropFilter: 'blur(0.1px) contrast(60%)',
}
