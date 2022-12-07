import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import {nanoid} from "nanoid";
import {Profile} from "../model/Profile";

export function setProfile(profile: Profile): Promise<Profile> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // WE NEED TO MIGRATE FOLLOWING CODE TO SERVER SIDE
            if(isEmptyText(profile.id)){
                profile.id = nanoid();
            }
            localStorage.setItem('app-context-profile',JSON.stringify(profile));
            resolve(profile);
        }, 300);
    })
}