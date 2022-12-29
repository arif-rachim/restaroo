import {BaseState} from "./BaseState";
import {useAppContext} from "./useAppContext";
import {Store} from "../components/utils";

export function useAppStore<T extends BaseState>() {
    const {store} = useAppContext();
    const anyStore: any = store;
    return anyStore as Store<T>;
}
