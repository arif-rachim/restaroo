import {useAppContext} from "../useAppContext";
import produce from "immer";
import {Address} from "./Address";
import {useStoreValue} from "../../components/utils";

export function useAddress() {
    const {store} = useAppContext();
    const addresses: Address[] = useStoreValue(store, s => s.addresses);


    async function removeAddress(addressId: string) {

        store.setState(produce(s => {
            const indexToRemove = s.addresses.findIndex(s => s.id === addressId);
            s.addresses.splice(indexToRemove, 1);
        }));
    }

    async function getNearestAddress() {
        return addresses[0];
    }

    return {removeAddress, addresses, getNearestAddress};
}