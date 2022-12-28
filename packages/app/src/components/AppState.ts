import {Profile} from "../model/Profile";
import {Address} from "../model/Address";
import {CartItem} from "../routes/DeliveryPage";

export interface AppState {
    user: Profile,
    addresses : Address[],
    shoppingCart : CartItem[]
}
