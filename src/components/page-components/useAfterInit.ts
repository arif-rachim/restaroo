import {DependencyList, EffectCallback, useEffect, useRef} from "react";

export function useAfterInit(effect:EffectCallback,deps?:DependencyList){
    const isMounted = useRef<boolean>(false);
    const effectRef = useRef<EffectCallback>(effect);
    effectRef.current = effect;
    useEffect(() => {
        if(!isMounted.current){
            isMounted.current = true;
            return;
        }
        effectRef.current.call(null);
    },deps);
}