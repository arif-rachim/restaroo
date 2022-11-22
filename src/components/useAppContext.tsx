import {
    createContext,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useCallback,
    useContext,
    useMemo
} from "react";
import {createStoreInitValue, Store} from "./store/useStore";
import {AppState} from "./AppState";
import {WindowSizeContext} from "../App";
import {GuestProfile} from "../model/Profile";
import {PickerOptions, ShowPickerFunction} from "./page-components/picker/PickerProvider";
import invariant from "tiny-invariant";

export function useAppContext() {
    return useContext(AppContext);
}

interface Dimension {
    width: number,
    height: number
}

interface AppContextType {
    appDimension: Dimension,
    appType: AppType,
    showModal: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    showSlidePanel: <T>(factoryFunction: FactoryFunction<T>) => Promise<T>,
    showPicker: PickerFunction,
    store: Store<AppState>,
}


enum AppType {
    Mobile,
    Tablet,
    Laptop,
    Desktop
}


const Nothing: any = () => {
}
const AppContext = createContext<AppContextType>({
        appDimension: {width: 0, height: 0},
        appType: AppType.Mobile,
        showModal: Nothing,
        showPicker: Nothing,
        showSlidePanel:Nothing,
        store: createStoreInitValue({user: GuestProfile})
    }
);

export type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;
export type PickerFunction = <T>(props: { picker: PickerOptions, value: T }) => Promise<T>;


export function AppContextProvider<State extends AppState>(props: PropsWithChildren<{
    panelStore:Store<{modalPanel:ReactElement | false,slidePanel:ReactElement | false}>
    store: Store<State>,
    showPickerRef: MutableRefObject<ShowPickerFunction | undefined>
}>) {

    const window = useContext(WindowSizeContext);
    const {panelStore, store, showPickerRef} = props;

    const showModal = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                panelStore.setState(old => ({...old,modalPanel:false}))
                resolve(value);
            }
            const element = factory(closePanel);
            panelStore.setState(old => ({...old,modalPanel:element}))
        })
    }, [panelStore]);

    const showSlidePanel = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                panelStore.setState(old => ({...old,slidePanel:false}))
                resolve(value);
            }
            const element = factory(closePanel);
            panelStore.setState(old => ({...old,slidePanel:element}))
        })
    }, [panelStore]);

    const showPicker: PickerFunction = useCallback((props: { picker: PickerOptions, value: any }) => {
        invariant(showPickerRef.current);
        return showPickerRef.current.call(null, props.picker, props.value);
    }, [showPickerRef]);

    const contextValue = useMemo(() => {
        const appDimension: Dimension = window;

        let appType = AppType.Desktop;
        if (appDimension.width <= 480) {
            appType = AppType.Mobile
        }

        if (appDimension.width < 768) {
            appType = AppType.Tablet
        }

        if (appDimension.width < 1024) {
            appType = AppType.Laptop
        }

        return {appDimension, appType, showModal, store, showPicker,showSlidePanel}
    }, [showModal,showSlidePanel, showPicker, store, window]);

    return <AppContext.Provider value={(contextValue as any)}>
        {props.children}
    </AppContext.Provider>
}
