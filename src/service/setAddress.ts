import {Address} from "../model/Address";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import {nanoid} from "nanoid";
import invariant from "tiny-invariant";

export function setAddress(address: Address): Promise<Address> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // WE NEED TO MIGRATE FOLLOWING CODE TO SERVER SIDE
            if(isEmptyText(address.id)){
                address.id = nanoid();
            }
            const addressString = localStorage.getItem('app-context-address');
            let addressData: Address[] = [];
            if (!isEmptyText(addressString)) {
                invariant(addressString);
                addressData = JSON.parse(addressString);
            }
            const index = addressData.findIndex(a => a.id === address.id);
            if (index >= 0) {
                addressData.splice(index, 1, address);
            } else {
                addressData.push(address);
            }
            localStorage.setItem('app-context-address',JSON.stringify(addressData));
            resolve(address);
        }, 300);
    })
}