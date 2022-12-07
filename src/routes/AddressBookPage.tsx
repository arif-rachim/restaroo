import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {IoAdd} from "react-icons/io5";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {red} from "./Theme";
import {AnimatePresence, motion} from "framer-motion";
import {MdCheck, MdDelete, MdOutlineHome, MdOutlineHotel, MdOutlineLocationOn, MdWorkOutline} from "react-icons/md";
import {useNavigate} from "../components/useNavigate";
import {useAddress} from "../model/useAddress";

const ICONS: any = {
    'Home': MdOutlineHome,
    'Work': MdWorkOutline,
    'Hotel': MdOutlineHotel
}

export function AddressBookPage() {
    const isLoading = false;
    const navigate = useNavigate();
    const {removeAddress, addresses,setDefaultAddress} = useAddress();
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
                        <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>
                            <div style={{lineHeight: 2}}>{address.buildingOrPremiseName}</div>
                            <div style={{lineHeight: 1.3}}>{address.areaOrStreetName}</div>
                            <div style={{display: 'flex', margin: '10px 0px'}}>
                                <motion.div style={{display: 'flex', alignItems: 'center'}} whileTap={{scale: 0.95}} onClick={async (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    await setDefaultAddress(address.id)
                                }}>

                                    <div>Default delivery address</div>
                                    {address.defaultAddress &&
                                        <MdCheck style={{color: red, marginLeft: 5}}/>
                                    }
                                </motion.div>
                                <div style={{flexGrow:1}}/>
                                <motion.div style={{display: 'flex', alignItems: 'center', marginLeft: 20}}
                                            whileTap={{scale: 0.95}} onClick={async (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    await removeAddress(address.id)
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
