import {Address} from "../model/Address";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import invariant from "tiny-invariant";

export function deleteAddress(id:string){
    return new Promise(resolve => {
        setTimeout(() => {
            // WE NEED TO MIGRATE FOLLOWING CODE TO SERVER SIDE
            const addressString = localStorage.getItem('app-context-address');
            let address:Address[] = [];
            if(!isEmptyText(addressString)){
                invariant(addressString);
                address = JSON.parse(addressString);
            }
            const cleanAddress = address.filter(s => s.id !== id);
            localStorage.setItem('app-context-address',JSON.stringify(cleanAddress));
            resolve(cleanAddress);
        }, 300)
    })
}