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
import {createStoreInitValue, Store, useStore, useStoreValue} from "../components/utils";
import {PickerOptions, ShowPickerFunction} from "../components/input";
import {BaseState} from "./BaseState";
import {GuestProfile} from "./profile";
import invariant from "tiny-invariant";

export const HeaderFooterVisibilityContext = createContext<{ footerVisibleStore?: Store<boolean>, headerVisibleStore?: Store<boolean> }>({});

export function useAppContext() {
    return useContext(AppContext);
}


interface AppContextType {
    showModal: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    showSlidePanel: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    showPicker: PickerFunction,
    store: Store<BaseState>,
    showHeader: Dispatch<SetStateAction<boolean>>,
    showFooter: Dispatch<SetStateAction<boolean>>,
}


const Nothing: any = () => {
}
const AppContext = createContext<AppContextType>({
        showModal: Nothing,
        showPicker: Nothing,
        showSlidePanel: Nothing,
        showHeader: Nothing,
        showFooter: Nothing,
        store: createStoreInitValue<BaseState>({user: GuestProfile, addresses: []})
    }
);


export type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;
export type PickerFunction = <T>(props: { picker: PickerOptions, value: T }) => Promise<T>;

export function AppContextProvider<State extends BaseState>(props: PropsWithChildren<{
    panelStore: Store<{ modalPanel: ReactElement | false, slidePanel: ReactElement | false }>
    store: Store<State>,
    showPickerRef: MutableRefObject<ShowPickerFunction | undefined>
}>) {

    const {panelStore, store, showPickerRef} = props;

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

    const showSlidePanel = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                panelStore.set(old => ({...old, slidePanel: false}))
                resolve(value);
            }
            const element = factory(closePanel);
            panelStore.set(old => ({...old, slidePanel: element}))
        })
    }, [panelStore]);

    const showPicker: PickerFunction = useCallback((props: { picker: PickerOptions, value: any }) => {
        invariant(showPickerRef.current);
        return showPickerRef.current.call(null, props.picker, props.value);
    }, [showPickerRef]);

    const contextValue = useMemo(() => {
        const showHeader = headerVisibleStore.set;
        const showFooter = footerVisibleStore.set;
        return {showModal, store, showPicker, showSlidePanel, showHeader, showFooter}
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