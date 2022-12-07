import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import invariant from "tiny-invariant";
import {GuestProfile, Profile} from "../model/Profile";

export function getProfile(): Promise<Profile> {
    return new Promise(resolve => {
        setTimeout(() => {
            // WE NEED TO MIGRATE FOLLOWING CODE TO SERVER SIDE
            const profileString = localStorage.getItem('app-context-profile');
            let profile:Profile = GuestProfile;
            if(!isEmptyText(profileString)){
                invariant(profileString);
                profile = JSON.parse(profileString);
            }
            resolve(profile);
        }, 300)
    })
}