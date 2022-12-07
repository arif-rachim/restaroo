import {useAppContext} from "../components/useAppContext";
import {useStoreValue} from "../components/store/useStore";
import {GuestProfile, Profile} from "./Profile";
import produce from "immer";
import {setProfile} from "../service/setProfile";

export function useProfile() {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive() {
    return useProfile().id !== GuestProfile.id;
}

export function useProfileSetter() {
    const {store} = useAppContext();
    return async function setUserProfile(profile: Profile) {
        const persistedProfile:Profile = await setProfile(profile)
        store.setState(produce(s => {
            s.user = persistedProfile
        }));
    }
}