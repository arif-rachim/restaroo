import {Address} from "./Address";
import {setAddress} from "../service/setAddress";
import {useAppContext} from "../components/useAppContext";
import produce from "immer";
import {deleteAddress} from "../service/deleteAddress";
import {useStoreValue} from "../components/store/useStore";
import {selectDefaultAddress} from "../service/selectDefaultAddress";

export function useAddress(){
    const {store} = useAppContext();
    const addresses = useStoreValue(store,s => s.addresses);
    async function saveAddress(address:Address){
        const persistedAddress = await setAddress({...address});
        store.setState(produce(s => {
            const index = s.addresses.findIndex(s => s.id === persistedAddress.id);
            if(index >= 0){
                s.addresses.splice(index,1,persistedAddress);
            }else{
                s.addresses.push(persistedAddress);
            }
        }));
        return persistedAddress;
    }

    async function removeAddress(addressId:string){
        await deleteAddress(addressId);
        store.setState(produce(s => {
            const indexToRemove = s.addresses.findIndex(s => s.id === addressId);
            s.addresses.splice(indexToRemove,1);
        }));
    }
    async function setDefaultAddress(addressId:string){
        await selectDefaultAddress(addressId);
        store.setState(produce(s => {
            s.addresses.forEach(address => address.defaultAddress = address.id === addressId);
        }));
    }
    async function getNearestAddress(){
        return addresses[0];
    }
    return {saveAddress,removeAddress,setDefaultAddress,addresses,getNearestAddress};
}