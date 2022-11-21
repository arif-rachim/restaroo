import {
    createContext,
    Dispatch,
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
        store: createStoreInitValue({user: GuestProfile})
    }
);

type FactoryFunction<T> = (closePanel: (val: T) => void) => ReactElement;
type PickerFunction = <T>(props: { picker: PickerOptions, value: T }) => Promise<T>;


export function AppContextProvider<State extends AppState>(props: PropsWithChildren<{
    setModalPanel: Dispatch<ReactElement | false>,
    store: Store<State>,
    showPickerRef: MutableRefObject<ShowPickerFunction | undefined>
}>) {

    const window = useContext(WindowSizeContext);
    const {setModalPanel, store, showPickerRef} = props;

    const showModal = useCallback((factory: FactoryFunction<any>) => {
        return new Promise<any>(resolve => {
            const closePanel = (value: any) => {
                setModalPanel(false);
                resolve(value);
            }
            const element = factory(closePanel);
            setModalPanel(element)
        })
    }, [setModalPanel]);

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

        return {appDimension, appType, showModal, store, showPicker}
    }, [showModal, showPicker, store, window]);

    return <AppContext.Provider value={(contextValue as any)}>
        {props.children}
    </AppContext.Provider>
}
