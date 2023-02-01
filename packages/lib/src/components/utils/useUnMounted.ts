import {useEffect, useRef} from "react";

export function useUnMounted(callback: () => void) {
    const ref = useRef(callback);
    ref.current = callback;
    useEffect(() => {
        return () => {
            ref.current();
        }
    }, []);
}