import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {useEffect, useState} from "react";
import {Address} from "../model/Address";
import {IoAdd, IoHomeOutline} from "react-icons/io5";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {red} from "./Theme";
import {motion} from "framer-motion";
import {MdDelete, MdEdit} from "react-icons/md";
import {useNavigate} from "../components/useNavigate";

export function AddressBookPage() {
    const {isLoading, result: addresses} = useAddresses();
    const navigate = useNavigate();
    return <Page>
        <Header title={'My Address'} size={'big'}>
            <div style={{display:'flex',margin: '20px 10px 0px 10px',paddingBottom: 5, borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <motion.div style={{ display: 'flex', alignItems: 'center'}}
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
                {addresses.map(address => {
                    return <div
                        style={{display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)'}}
                        key={address.name}>
                        <div style={{padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <IoHomeOutline style={{fontSize: 20}}/>
                            <div style={{whiteSpace: 'nowrap', fontSize: 11}}>38 m</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{lineHeight: 2}}>{address.name}</div>
                            <div style={{lineHeight: 1.3}}>{address.address}</div>
                            <div style={{display: 'flex', margin: '10px 0px'}}>
                                <motion.div style={{display: 'flex', alignItems: 'center'}} whileTap={{scale: 0.95}}>
                                    <MdEdit style={{color: red, marginRight: 5}}/>
                                    Edit
                                </motion.div>
                                <motion.div style={{display: 'flex', alignItems: 'center', marginLeft: 20}}
                                            whileTap={{scale: 0.95}}>
                                    <MdDelete style={{color: red, marginRight: 5}}/>
                                    Delete
                                </motion.div>
                            </div>
                        </div>
                    </div>
                })}
            </SkeletonBox>
        </div>

    </Page>
}

function useAddresses() {
    const [result, setResult] = useState<{ isLoading: boolean, result: Address[] }>({isLoading: false, result: []});
    useEffect(() => {
        (async () => {
            setResult({isLoading: true, result: []});
            const addresses = await fetchAddresses();
            setResult({isLoading: false, result: addresses});
        })();
    }, []);
    return result;
}

function fetchAddresses(): Promise<Address[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    name: 'Home',
                    address: 'Marina Diamond 5, Flat 806, Dubai Marina, Dubai Marina',
                    lat: 0,
                    lon: 0,
                    type: "Home"
                }
            ]);
        }, 300)
    })
}