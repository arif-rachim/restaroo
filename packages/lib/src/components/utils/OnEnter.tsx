import {
    ComponentType,
    FunctionComponent,
    PropsWithChildren,
    createElement,
    HTMLAttributes,
    useEffect,
    useId, cloneElement
} from "react";

export function OnEnter<P>(props:PropsWithChildren<{onEnter:(event:KeyboardEvent) => void}>){
    const {onEnter,children} = props;
    const cp = (children as any).props;
    function keyDownListener(event:KeyboardEvent){
        if(event.key === 'Enter' && onEnter){
            onEnter(event);
        }
    }

    const childrenProps = {...cp,onKeyDown:keyDownListener};
    return cloneElement((children as any), childrenProps)
}
