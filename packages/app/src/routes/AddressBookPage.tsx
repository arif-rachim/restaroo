import {Page} from "./Page";
import {Header, red, SkeletonBox, useAppContext, useNavigate, useStoreValue} from "@restaroo/lib";
import {IoAdd} from "react-icons/io5";
import {AnimatePresence, motion} from "framer-motion";
import {MdDelete, MdOutlineHome, MdOutlineHotel, MdOutlineLocationOn, MdWorkOutline} from "react-icons/md";
import {pocketBase} from "../service";
import {produce} from "immer";

const ICONS: any = {
    'Home': MdOutlineHome,
    'Work': MdWorkOutline,
    'Hotel': MdOutlineHotel
}

export function AddressBookPage() {
    const isLoading = false;
    const navigate = useNavigate();
    const {store: appStore} = useAppContext();
    const addresses = useStoreValue(appStore, s => s.addresses);
    return <Page>
        <Header title={'My Address'} size={'big'}>
            <div style={{
                display: 'flex',
                margin: '20px 10px 0px 10px',
                paddingBottom: 5,
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <motion.div style={{display: 'flex', alignItems: 'center'}}
                            whileTap={{scale: 0.95}} onTap={() => {
                    navigate('delivery-location');
                }}>
                    <div style={{fontSize: 20}}>
                        <IoAdd style={{color: red}}/>
                    </div>
                    <div style={{paddingBottom: 3, marginLeft: 5}}>
                        Add Address
                    </div>
                </motion.div>
            </div>
        </Header>
        <div style={{display: 'flex', flexDirection: 'column', padding: '0px 10px'}}>
            <SkeletonBox skeletonVisible={isLoading} style={{height: 20, margin: 0}}>
                <AnimatePresence>
                    {addresses.map(address => {
                        const Icon = address.location in ICONS ? ICONS[address.location] : MdOutlineLocationOn;
                        return <motion.div
                            style={{display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)'}}
                            key={address.id} onClick={() => {
                            navigate(`delivery-location/${address.id}`)
                        }} whileTap={{scale: 0.95}} layout>
                            <div style={{padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Icon style={{fontSize: 20}}/>
                                <div style={{whiteSpace: 'nowrap', fontSize: 11}}>38 m</div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                                <div style={{lineHeight: 2}}>{address.buildingOrPremiseName}</div>
                                <div style={{lineHeight: 1.3}}>{address.areaOrStreetName}</div>
                                <div style={{display: 'flex', margin: '10px 0px'}}>

                                    <div style={{flexGrow: 1}}/>
                                    <motion.div style={{display: 'flex', alignItems: 'center', marginLeft: 20}}
                                                whileTap={{scale: 0.95}} onClick={async (event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        await pocketBase.collection('address').delete(address.id)
                                        appStore.set(produce(s => {
                                            const addressIndex = s.addresses.findIndex(a => a.id === address.id);
                                            s.addresses.splice(addressIndex, 1);
                                        }))

                                    }}>
                                        <MdDelete style={{color: red, marginRight: 5}}/>
                                        Delete
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    })}
                </AnimatePresence>
            </SkeletonBox>
        </div>
    </Page>
}