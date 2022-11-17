import {Auditable} from "./Auditable";

export interface Product extends Auditable{
    id : string,
    name : string,
    description : string,
    price : number
}