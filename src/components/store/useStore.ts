import {
    cloneElement,
    DependencyList,
    MutableRefObject,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

type Listener = (next: any, prev: any) => void

export interface Action {
    type: string,
    payload: any,

    [key: string]: any
}

export interface Store<S> {
    stateRef: MutableRefObject<S>,
    addListener: (state: any) => () => void,
    dispatch: (action: Action) => void,
    setState: (newStateOrCallback: S | ((currentState: S) => S)) => void
}

export function createStoreInitValue<T>(param: T): Store<T> {
    return {
        stateRef: {current: param}, setState: () => {
        }, dispatch: () => {
        }, addListener: () => () => {
        }
    };
}

export function useStore<S>(initializer: S | (() => S), reducer?: (action: Action) => (oldState: S) => S): Store<S> {

    const listenerRef = useRef<Listener[]>([]);
    const reducerRef = useRef(reducer)
    reducerRef.current = reducer;

    const [initialState] = useState<S>(() => {
        let stateInitial: any = initializer;
        if (isFunction(initializer)) {
            stateInitial = (initializer as any)();
        }
        return stateInitial as S;
    });
    const stateRef = useRef<S>(initialState);

    const dispatch = useCallback(function dispatch(action: Action) {
        if (reducerRef.current === undefined) {
            throw new Error('You cannot use dispatch when there is no reducer defined in store')
        }
        const newState = reducerRef.current(action)(stateRef.current);
        if (newState === stateRef.current) {
            return;
        }
        const prevState = stateRef.current;
        stateRef.current = newState;
        listenerRef.current.forEach(l => l.call(null, newState, prevState));

    }, []);

    const setState = useCallback(function setState(param: S | ((param: S) => S)) {
        let newState: S = param as S;
        if (isFunction(param)) {
            const functionParam = param as (param: S) => S
            newState = functionParam(stateRef.current)
        }
        if (newState === stateRef.current) {
            return;
        }
        const prevState = stateRef.current;
        stateRef.current = newState;
        listenerRef.current.forEach(l => l.call(null, newState, prevState));
    }, []);

    const addListener = useCallback(function addListener(selector: (param: S, next: S) => any) {
        listenerRef.current.push(selector);
        return () => listenerRef.current = listenerRef.current.filter(l => l !== selector)
    }, []);

    return useMemo(() => ({dispatch, stateRef, addListener, setState}), [addListener, dispatch, setState])
}

export function useStoreListener<T, S>(store: Store<T>, selector: (param: T) => S, listener: (next: S, prev?: S) => void, deps?: DependencyList | undefined) {
    const {addListener, stateRef} = store;
    const propsRef = useRef({selector});
    propsRef.current = {selector};
    deps = deps ?? [];
    useEffect(() => {
        const next = propsRef.current.selector(stateRef.current);
        listener(next);

        return addListener((nextState: any, prevState: any) => {
            const {selector} = propsRef.current;
            const current = selector(prevState);
            const next = selector(nextState);
            if (!isMatch(next, current)) {
                listener(next, current);
            }
        });
        // eslint-disable-next-line
    }, deps);
}

export function useStoreValue<T, S>(store: Store<T>, selector: (param: T) => S, deps?: DependencyList | undefined) {
    const [value, setValue] = useState<S>(() => selector(store.stateRef.current));
    useStoreListener(store, selector, (next, prev) => {
        setValue(next)
    }, deps);
    return value;
}


function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

type Selector<T, S> = (param: T) => S;

interface StoreValueInjectorProps<T, S> {
    store: Store<T>,
    selector: (Selector<T, S> | Selector<T, any>[]),
    property: (string | string[])
}

function validateSelectorAndProperty<S, T>(selector: Selector<T, S> | (Selector<T, S>[]), property: string | string[]) {
    if (Array.isArray(selector) || Array.isArray(property)) {
        if (!(Array.isArray(selector) && Array.isArray(property))) {
            throw new Error('Expecting both selector and property are either both array or single');
        }
        if (selector.length !== property.length) {
            throw new Error('Expecting both selector and property have same array length');
        }
    }
}

export function StoreValue<T, S>(props: PropsWithChildren<StoreValueInjectorProps<T, S>>) {
    const {store, property, selector, children} = props;
    validateSelectorAndProperty(selector, property);
    const value: any = useStoreValue(store, (param) => {
        if (Array.isArray(selector)) {
            return selector.map(s => s(param));
        }
        return selector(param);
    }, [selector]);
    const cp = (children as any).props;
    const childrenProps: any = {...cp};
    if (Array.isArray(property)) {
        property.forEach((props, index) => {
            childrenProps[props] = value[index];
        })
    } else {
        childrenProps[property] = value;
    }
    return cloneElement((children as any), childrenProps)

}

const isMatch = (a: any, b: any) => {
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        const arrayA = a as [];
        const arrayB = b as [];
        if (arrayA.length === arrayB.length) {
            for (let i = 0; i < arrayA.length; i++) {
                if (arrayA[i] !== arrayB[i]) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}