import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useStore";
import {GuestProfile} from "./Profile";

export function useProfile() {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive() {
    return useProfile().id !== GuestProfile.id;
}
