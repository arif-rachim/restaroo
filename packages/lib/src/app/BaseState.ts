import {Profile} from "./profile";
import {Address} from "./address";

export interface BaseState {
    user: Profile,
    addresses: Address[]
}
