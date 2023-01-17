import {useAppContext} from "../useAppContext";
import {GuestProfile, Profile} from "./Profile";
import {FetchService, useStore, useStoreValue} from "../../components/utils";
import produce from "immer";
import PocketBase from "pocketbase";


export function useProfile(): Profile {
    return useStoreValue(useAppContext().store, s => s.user);
}

export function useSessionIsActive(): boolean {
    return useProfile().id !== GuestProfile.id;
}

export function useLogout(pocketBase: any) {
    // here we need to perform logout
    const {store} = useAppContext();
    return function logout() {
        pocketBase.authStore.clear();
        store.set(produce(s => {
            s.user = GuestProfile
        }));
    }
}

export function useLogin(props: { fetchService: FetchService, pocketBase: PocketBase, }) {
    const {fetchService, pocketBase} = props;
    const {store: appStore} = useAppContext();
    const store = useStore({token: ''})

    async function validateOtp(otp: string, phoneNo: string): Promise<Profile | false> {
        if (otp === store.get().token) {
            const profile = await getOrCreateProfile(phoneNo);
            return profile;
        }
        return false;
    }

    async function login(profile: Profile) {
        appStore.set(produce(s => {
            s.user = profile;
        }));
    }

    async function updateProfile(profile: Profile): Promise<Profile> {

        const record: {
            "id": string,
            "created": string,
            "updated": string,
            "username": string,
            "verified": boolean,
            "emailVisibility": boolean,
            "email": string,
            "name": string,
            "avatar": string
        } = await pocketBase.collection('users').update(profile.id, {name: profile.name});
        // await pocketBase.collection('users').requestEmailChange(profile.email);
        return {
            name: record.name,
            username: record.username,
            email: record.email,
            emailVisibility: record.emailVisibility,
            created: new Date(record.created),
            updated: new Date(record.updated),
            verified: record.verified,
            id: record.id,
            avatar: record.avatar
        }
    }


    async function fetchOtp(phoneNo: string, app: string) {
        const token = Math.random().toString().substr(2, 6);
        store.set({token: token});
        await fetchService('otp', {phone: phoneNo, otp: token, app: app});
    }


    /**
     * THIS IS THE FUNCTION TO FETCH USER PROFILE
     * @param token
     * @param phoneNo
     */
    async function getOrCreateProfile(phoneNo: string): Promise<Profile> {
        const userName = phoneNo.replace('+', '');
        try {
            const {record} = await pocketBase.collection('users').authWithPassword(userName, '12345678');
            return {
                username: record.username,
                email: record.email,
                name: record.name,
                id: record.id,
                created: new Date(record.created),
                updated: new Date(record.updated),
                emailVisibility: record.emailVisibility,
                verified: record.verified,
                avatar: record.avatar
            }
        } catch (err) {
            await pocketBase.collection('users').create({
                "username": userName,
                "password": "12345678",
                "passwordConfirm": "12345678",
                "name": ""
            });
            const {record} = await pocketBase.collection('users').authWithPassword(userName, '12345678');
            return {
                username: record.username,
                email: record.email,
                name: record.name,
                id: record.id,
                created: new Date(record.created),
                updated: new Date(record.updated),
                emailVisibility: record.emailVisibility,
                verified: record.verified,
                avatar: record.avatar
            }
        }
    }

    return {
        fetchOtp,
        validateOtp,
        updateProfile,
        login
    }
}


