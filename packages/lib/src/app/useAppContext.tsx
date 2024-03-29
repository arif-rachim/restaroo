import {
    createContext,
    Dispatch,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useCallback,
    useContext,
    useMemo
} from "react";
import {createStoreInitValue, FetchService, Store, useStore, useStoreValue} from "../components/utils";
import {PickerOptions, ShowPickerFunction} from "../components/input";
import {BaseState} from "./BaseState";
import {GuestProfile} from "./profile";
import invariant from "tiny-invariant";
import produce from "immer";
import {nanoid} from "nanoid";
import noNull from "../components/utils/noNull";
import PocketBase from "pocketbase";
import {ButtonTheme, red} from "../components/Theme";
import {Button} from "../components/page";
import {IoClose} from "react-icons/io5";

export const HeaderFooterVisibilityContext = createContext<{ footerVisibleStore?: Store<boolean>, headerVisibleStore?: Store<boolean> }>({});

export function useAppContext() {
    return useContext(AppContext);
}


interface AppContextType {
    showModal: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    showSlidePanel: <T>(factoryFunction: FactoryFunction<T>, config?: FactoryFunctionConfig) => Promise<T>,
    showPicker: PickerFunction,
    store: Store<BaseState>,
    showHeader: Dispatch<SetStateAction<boolean>>,
    showFooter: Dispatch<SetStateAction<boolean>>,
    pb: PocketBase,
    fetchService: FetchService
}


const Nothing: any = () => {
}

const AppContext = createContext<AppContextType>({
        showModal: Nothing,
        showPicker: Nothing,
        showSlidePanel: Nothing,
        showHeader: Nothing,
        showFooter: Nothing,
        store: createStoreInitValue<BaseState>({user: GuestProfile, addresses: []}),
    } as any
);

export type FactoryFunctionConfig = {
    position?: 'top' | 'left' | 'right' | 'bottom';
    isPopup?: boolean; // is popup meaning that the previous panel should not hide
}

export type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;
export type PickerFunction = <T>(props: { picker: PickerOptions, value: T }) => Promise<T>;

export function AppContextProvider<State extends BaseState>(props: PropsWithChildren<{
    panelStore: Store<{ modalPanel: ReactElement | false, slidePanel: ({ element: ReactElement, config: FactoryFunctionConfig, id: string })[] }>
    store: Store<State>,
    showPickerRef: MutableRefObject<ShowPickerFunction | undefined>,
    pocketBase: PocketBase,
    fetchService: FetchService
}>) {

    const {panelStore, store, showPickerRef, pocketBase, fetchService} = props;

    const footerVisibleStore = useStore(true);
    const headerVisibleStore = useStore(true);

    const showModal = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                panelStore.set(old => ({...old, modalPanel: false}))
                resolve(value);
            }
            const element = factory(closePanel);
            panelStore.set(old => ({...old, modalPanel: element}))
        })
    }, [panelStore]);

    const showSlidePanel = useCallback((factory: FactoryFunction<any>, config?: FactoryFunctionConfig) => {
        return new Promise<any>(resolve => {
            const id = nanoid();
            const closePanel = (value: any) => {
                panelStore.set(s => {
                    return {...s, slidePanel: s.slidePanel.filter(s => s.id !== id)}
                })
                resolve(value);
            }
            const element = factory(closePanel);
            const componentConfig: FactoryFunctionConfig = noNull(config, {position: 'bottom', isPopup: false});
            panelStore.set(produce(s => {
                s.slidePanel.push({id, config: componentConfig, element});
            }))
        })
    }, [panelStore]);

    const showPicker: PickerFunction = useCallback((props: { picker: PickerOptions, value: any }) => {
        invariant(showPickerRef.current);
        return showPickerRef.current.call(null, props.picker, props.value);
    }, [showPickerRef]);

    const proxyHandler: ProxyHandler<any> = useMemo(() => ({
        get(target: any, p: any): any {
            const val = target[p];
            if (p === 'send') {
                return async function send(...args: any[]) {
                    try {
                        return await val.apply(target, args);
                    } catch (err: any) {
                        await showModal(closePanel => {
                            return <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 10,
                                background: red,
                                color: 'white',
                                borderRadius: 10
                            }}>
                                <div>{err.message}</div>
                                <div style={{display: 'flex', flexDirection: 'row-reverse', marginTop: 5}}>
                                    <Button onTap={() => {
                                        closePanel(true);
                                    }} title={'Ok'} icon={IoClose} theme={ButtonTheme.danger}
                                            style={{color: 'white', fontSize: 13, padding: '5px 10px'}}
                                            iconStyle={{width: 13, height: 13}}/>
                                </div>
                            </div>
                        });
                        throw err;
                    }
                }
            }
            return val;
        }
    }), []);

    function createProxy<Client extends object>(client: Client): Client {
        return new Proxy(client, proxyHandler)
    }

    const pb = createProxy(pocketBase);
    const contextValue = useMemo(() => {
        const showHeader = headerVisibleStore.set;
        const showFooter = footerVisibleStore.set;
        return {showModal, store, showPicker, showSlidePanel, showHeader, showFooter, pb, fetchService}
    }, [showModal, showSlidePanel, showPicker, store, headerVisibleStore.set, footerVisibleStore.set]);

    return <AppContext.Provider value={(contextValue as any)}>
        <HeaderFooterVisibilityContext.Provider value={{headerVisibleStore, footerVisibleStore}}>
            {props.children}
        </HeaderFooterVisibilityContext.Provider>
    </AppContext.Provider>
}


export function useFooterVisible() {
    const store = useContext(HeaderFooterVisibilityContext).footerVisibleStore;
    invariant(store)
    return useStoreValue(store, s => s, []);
}

export function useHeaderVisible() {
    const store = useContext(HeaderFooterVisibilityContext).headerVisibleStore;
    invariant(store)
    return useStoreValue(store, s => s, []);
}