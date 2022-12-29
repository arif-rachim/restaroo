import {BaseState} from "@restaroo/lib";
import {CartItem} from "../routes/DeliveryPage";

export interface AppState extends BaseState {
    shoppingCart: CartItem[]
}