import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useStore";
import {GuestProfile, Profile} from "./Profile";
import produce from "immer";

export function useUserProfile() {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive() {
    return useUserProfile().id !== GuestProfile.id;
}

export function useUserProfileSetter() {
    const {store} = useAppContext();
    return function setUserProfile(profile: Profile) {
        store.setState(produce(s => {
            s.user = profile
        }))
    }
}