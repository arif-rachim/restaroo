import {DependencyList, useEffect} from "react";

export function useAsyncEffect(callback: (params: { onExit: (callback: () => void) => void }) => Promise<void>, deps?: DependencyList) {
    useEffect(() => {
        let onExitCallback = () => {
        };

        function onExit(callback: () => void) {
            onExitCallback = callback;
        }

        callback({onExit}).then();
        return () => {
            onExitCallback();
        }
    }, deps);
}
