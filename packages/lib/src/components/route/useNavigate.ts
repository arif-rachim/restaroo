import {useCallback} from "react";
import {nanoid} from "nanoid";

const CALLER_ID_KEY = 'c';

interface RouteIdListener {
    [key: string]: (val: unknown) => void;
}

const routeIdListeners: RouteIdListener = {};

export function useNavigate() {
    return useCallback(function navigate(path: string, callback?: (param: unknown) => void) {
        const routeId = nanoid();
        if (path.startsWith('#')) {
            path = path.substring(1, path.length);
        }
        if (path.startsWith('/')) {
            path = path.substring(1, path.length);
        }
        if (callback !== undefined) {
            path = path + (path.includes('?') ? '&' : '?') + `${CALLER_ID_KEY}=${routeId}`;
            routeIdListeners[routeId] = callback;
        }
        window.location.hash = '#' + path;
    }, []);
}

export function useNavigatePromise(): (path: string) => Promise<any> {
    const navigate = useNavigate()
    return (path: string) => {
        return new Promise(resolve => {
            navigate(path, resolve)
        })
    }
}

export function useNavigateBack() {
    function back(value: unknown) {
        const hash = window.location.hash;
        if (!(hash && hash.includes('?'))) {
            return window.history.back();
        }
        const [, query] = hash.split('?');
        if (!query) {
            return window.history.back();
        }
        const callerId = query.split('&').find(s => s.indexOf(CALLER_ID_KEY + '=') === 0);
        if (!callerId) {
            return window.history.back();
        }
        const [, id] = callerId.split('=');
        if (!(routeIdListeners[id])) {
            return window.history.back();
        }
        routeIdListeners[id].call(null, value);
        delete routeIdListeners[id];
        window.history.back();
    }

    return back;
}