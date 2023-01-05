import {useAppContext} from "../useAppContext";
import {GuestProfile, Profile} from "./Profile";
import {useStoreValue} from "../../components/utils";

export function useProfile(): Profile {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive(): boolean {
    return useProfile().id !== GuestProfile.id;
}
