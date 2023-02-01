import {EffectCallback, useEffect} from "react";

export function useMounted(effect: EffectCallback) {
    useEffect(effect, []);
}