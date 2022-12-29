import {createContext, useContext, useMemo} from "react";

export const WindowSizeContext = createContext<{ width: number, height: number }>({width: 0, height: 0})

interface Dimension {
    width: number,
    height: number
}


enum AppType {
    Mobile,
    Tablet,
    Laptop,
    Desktop
}


export function useAppDimension(): { appType: AppType, appDimension: Dimension } {
    const appDimension: Dimension = useContext(WindowSizeContext);
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
    const result = useMemo(() => ({appType, appDimension}), [appType, appDimension]);
    return result;
}