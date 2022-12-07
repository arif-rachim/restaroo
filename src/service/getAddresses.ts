import {Address} from "../model/Address";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import invariant from "tiny-invariant";

export function getAddresses(): Promise<Address[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            // WE NEED TO MIGRATE FOLLOWING CODE TO SERVER SIDE
            const addressString = localStorage.getItem('app-context-address');
            let address:Address[] = [];
            if(!isEmptyText(addressString)){
                invariant(addressString);
                address = JSON.parse(addressString);
            }
            resolve(address);
        }, 300)
    })
}