import {useAppContext} from "../useAppContext";
import {GuestProfile, Profile} from "./Profile";
import {useStoreValue} from "../../components/utils";
import produce from "immer";


export function useProfile(): Profile {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive(): boolean {
    return useProfile().id !== GuestProfile.id;
}

export function useLogout(pocketBase:any){
    // here we need to perform logout
    const {store} = useAppContext();
    return function logout(){
        pocketBase.authStore.clear();
        store.set(produce(s => {
            s.user = GuestProfile
        }));
    }
}