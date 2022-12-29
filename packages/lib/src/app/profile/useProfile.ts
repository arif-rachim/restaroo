import {useAppContext} from "../useAppContext";
import {GuestProfile} from "./Profile";
import {useStoreValue} from "../../components/utils";

export function useProfile() {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive() {
    return useProfile().id !== GuestProfile.id;
}
