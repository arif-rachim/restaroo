import {usePreviousValue} from "./usePreviousValue";
import {DependencyList} from "react";
import noNull from "./noNull";

export function useWhichChange(deps?: DependencyList | undefined) {
    deps = noNull(deps, []);
    const prevValue = usePreviousValue(deps);
    const unMatchedValue: { prevVal: any, nextVal: any, index: number }[] = [];
    deps.forEach((dep, index) => {
        if (prevValue && dep !== prevValue[index]) {
            unMatchedValue.push({nextVal: dep, prevVal: prevValue[index], index});
        }
    });
    if (unMatchedValue.length > 0) {
        console.group('Use Which Change Deps Triggered');
        unMatchedValue.forEach(function forEach(c) {
            console.trace('Index', c.index, 'originalValue', c.prevVal, 'nextValue', c.nextVal);
        });
        console.groupEnd();

    }
}