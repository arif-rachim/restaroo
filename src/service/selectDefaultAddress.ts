import {Address} from "../model/Address";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import invariant from "tiny-invariant";

export function selectDefaultAddress(addressId:string): Promise<Address> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const addressString = localStorage.getItem('app-context-address');
            let addressData: Address[] = [];
            if (!isEmptyText(addressString)) {
                invariant(addressString);
                addressData = JSON.parse(addressString);
            }
            addressData.forEach(data => data.defaultAddress = data.id === addressId);
            localStorage.setItem('app-context-address',JSON.stringify(addressData));
            const address = addressData.find(a => a.id === addressId);
            invariant(address);
            resolve(address);
        }, 300);
    })
}