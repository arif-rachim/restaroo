import {Page} from "./Page";
import {
    Address,
    Button,
    ButtonTheme,
    disabledColor,
    getLocationAddress,
    GuestAddress,
    Header,
    Input,
    isEmptyObject,
    isEmptyText,
    isNullOrUndefined,
    red,
    RouteProps,
    SkeletonBox,
    StoreValue,
    useAppContext,
    useAppDimension,
    useCurrentPosition,
    useStore,
    useStoreValue,
    Visible
} from "@restaroo/lib";
import {useCallback, useEffect, useId, useRef, useState} from "react";
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {Icon, map as createMap, Map, tileLayer as createTile} from "leaflet";
import invariant from "tiny-invariant";
import {IoLocation, IoSaveOutline} from "react-icons/io5";
import {AnimatePresence, motion} from "framer-motion";
import {MdCancel} from "react-icons/md";
import produce from "immer";
import {SlideDetail} from "./SlideDetail";

function LocationSelector(props: { value?: string, onChange: (value: string) => void, error?: string }) {
    const {value, onChange, error} = props;

    const customLocation = ['Home', 'Work', 'Hotel'].indexOf(value ?? '') < 0;
    const border = (isFocused: boolean) => `1px solid ${isFocused ? red : 'rgba(0,0,0,0.1)'}`
    const color = (isFocused: boolean) => isFocused ? red : '#333';

    return <AnimatePresence>
        <div style={{display: 'flex', marginBottom: 10, alignItems: 'center'}}>
            {!customLocation &&
                <motion.div initial={{width: 0}} animate={{width: 190}} exit={{width: 0}} layout={true}
                            style={{display: 'flex', overflow: 'hidden'}}>
                    <motion.div layout={true} style={{
                        padding: 10,
                        border: border(value === 'Home'),
                        borderRadius: 10,
                        marginRight: 10,
                        color: color(value === 'Home')
                    }}
                                whileTap={{scale: 0.95}} onTap={() => onChange('Home')}>Home
                    </motion.div>
                    <motion.div layout={true} style={{
                        padding: 10,
                        border: border(value === 'Work'),
                        borderRadius: 10,
                        marginRight: 10,
                        color: color(value === 'Work')
                    }}
                                whileTap={{scale: 0.95}} onTap={() => onChange('Work')}>Work
                    </motion.div>
                    <motion.div layout={true} style={{
                        padding: 10,
                        border: border(value === 'Hotel'),
                        borderRadius: 10,
                        marginRight: 10,
                        color: color(value === 'Hotel')
                    }}
                                whileTap={{scale: 0.95}} onTap={() => onChange('Hotel')}>Hotel
                    </motion.div>
                </motion.div>
            }
            <motion.div layout={true} style={{
                padding: 10,
                border: border(customLocation),
                borderRadius: 10,
                marginRight: 10,
                color: color(customLocation)
            }}
                        whileTap={{scale: 0.95}} onTap={() => onChange('')}>Other
            </motion.div>
            {customLocation &&
                <motion.div layout={true} style={{display: 'flex', flexGrow: 1, alignItems: 'center', overflow: 'auto'}}
                            initial={{opacity: 0, width: 0}} animate={{opacity: 1, width: '100%'}}
                            exit={{opacity: 0, width: 0}}>
                    <Input title={'Save as'} placeholder={''} titlePosition={'left'} style={{
                        containerStyle: {flexGrow: 1, marginBottom: -20, borderBottom: 'none'},
                        titleStyle: {fontSize: 13},
                        inputStyle: {fontSize: 16}
                    }} error={error}
                           onChange={(event) => {
                               onChange(event.target.value)
                           }}
                    />
                    <motion.div layout={true} style={{marginLeft: 10}} onClick={() => {
                        onChange('Home')
                    }}>
                        <MdCancel style={{fontSize: 20, color: disabledColor}}/>
                    </motion.div>
                </motion.div>
            }
        </div>
    </AnimatePresence>;
}

function AddressSlidePanel(props: { closePanel: (val: Address | false) => void, address?: Address }) {
    let {closePanel, address} = props;
    address = address ?? GuestAddress;

    const {store: appStore, pb} = useAppContext();
    const store = useStore<Address & {
        errors: {
            areaOrStreetName: string,
            buildingOrPremiseName: string,
            houseOrFlatNo: string,
            location: string,
        }
    }>({...address, errors: {areaOrStreetName: '', buildingOrPremiseName: '', houseOrFlatNo: '', location: ''}});
    const isValid = useCallback(() => {
        store.set(produce(s => {
            s.errors.areaOrStreetName = isEmptyText(s.areaOrStreetName) ? 'Area nonull Street name is required' : '';
            s.errors.buildingOrPremiseName = isEmptyText(s.buildingOrPremiseName) ? 'Building nonull Premise name is required' : '';
            s.errors.houseOrFlatNo = isEmptyText(s.houseOrFlatNo) ? 'house nonull Flat number is required' : '';
            s.errors.location = isEmptyText(s.location) ? 'Location is required' : '';
        }));
        return isEmptyObject(store.get().errors);
    }, [store]);
    const [busy, setBusy] = useState(false);
    return <SlideDetail closePanel={closePanel}>
        <div style={{
            fontSize: 20,
            fontWeight: 20,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            padding: '5px 0px 10px 0px',
            marginBottom: 5
        }}>Enter complete address
        </div>
        <div style={{marginBottom: 10}}>Tag this location for later *</div>
        <StoreValue store={store} selector={param => [param.location, param.errors.location]}
                    property={['value', 'error']}>
            <LocationSelector onChange={(newValue: string) => {
                store.set(produce(s => {
                    s.location = newValue;
                    s.errors.location = '';
                }));
            }}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.houseOrFlatNo, s.errors.houseOrFlatNo]}
                    property={['value', 'error']}>
            <Input title={'House no. / Flat no. *'} placeholder={'Please enter house no / Flat no'}
                   style={{inputStyle: {fontSize: 16}, titleStyle: {fontSize: 13}}} onChange={(event) => {
                store.set(produce(s => {
                    s.houseOrFlatNo = event.target.value;
                    s.errors.houseOrFlatNo = '';
                }));
            }}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.buildingOrPremiseName, s.errors.buildingOrPremiseName]}
                    property={['value', 'error']}>
            <Input title={'Building / Premise Name *'} placeholder={'Please enter building nonull premise'}
                   style={{inputStyle: {fontSize: 16}, titleStyle: {fontSize: 13}}} onChange={(event) => {
                store.set(produce(s => {
                    s.buildingOrPremiseName = event.target.value;
                    s.errors.buildingOrPremiseName = '';
                }));
            }}/>
        </StoreValue>
        <StoreValue store={store} selector={s => [s.areaOrStreetName, s.errors.areaOrStreetName]}
                    property={['value', 'error']}>
            <Input title={'Area / Street *'} placeholder={'Please find area nonull street address'}
                   style={{inputStyle: {fontSize: 16}, titleStyle: {fontSize: 13}}} onChange={(event) => {
                store.set(produce(s => {
                    s.areaOrStreetName = event.target.value;
                    s.errors.areaOrStreetName = '';
                }));
            }}/>
        </StoreValue>
        <StoreValue store={store} selector={s => s.landmark} property={'value'}>
            <Input title={'Landmark'} placeholder={'(Optional)'}
                   style={{inputStyle: {fontSize: 16}, titleStyle: {fontSize: 13}}} onChange={(event) => {
                store.set(produce(s => {
                    s.landmark = event.target.value;
                }));
            }}/>
        </StoreValue>
        <Button title={'Save address'} onTap={() => {
            if (isValid()) {
                (async () => {
                    setBusy(true);
                    // eslint-disable-next-line
                    const currentAddress = store.get();
                    if (currentAddress.id) {
                        const record: any = await pb.collection('address').update(currentAddress.id, {
                            "location": currentAddress.location,
                            "houseOrFlatNo": currentAddress.houseOrFlatNo,
                            "buildingOrPremiseName": currentAddress.buildingOrPremiseName,
                            "areaOrStreetName": currentAddress.areaOrStreetName,
                            "landmark": currentAddress.landmark,
                            "lat": currentAddress.lat,
                            "lng": currentAddress.lng,
                        });
                        appStore.set(produce(s => {
                            const indexToReplace = s.addresses.findIndex(s => s.id === record.id);
                            s.addresses.splice(indexToReplace, 1, {
                                id: record.id,
                                areaOrStreetName: record.areaOrStreetName,
                                buildingOrPremiseName: record.buildingOrPremiseName,
                                houseOrFlatNo: record.houseOrFlatNo,
                                lng: record.lng,
                                location: record.location,
                                lat: record.lat,
                                landmark: record.landmark
                            })
                        }));
                    } else {
                        const record: any = await pb.collection('address').create({
                            "location": currentAddress.location,
                            "houseOrFlatNo": currentAddress.houseOrFlatNo,
                            "buildingOrPremiseName": currentAddress.buildingOrPremiseName,
                            "areaOrStreetName": currentAddress.areaOrStreetName,
                            "landmark": currentAddress.landmark,
                            "lat": currentAddress.lat,
                            "lng": currentAddress.lng,
                            "user": appStore.get().user.id
                        });

                        appStore.set(produce(s => {
                            s.addresses.push({
                                id: record.id,
                                areaOrStreetName: record.areaOrStreetName,
                                buildingOrPremiseName: record.buildingOrPremiseName,
                                houseOrFlatNo: record.houseOrFlatNo,
                                lng: record.lng,
                                location: record.location,
                                lat: record.lat,
                                landmark: record.landmark
                            });
                        }));
                    }

                    setBusy(false);
                    closePanel(store.get());
                })();
            }
        }} theme={ButtonTheme.danger} icon={IoSaveOutline} isBusy={busy}/>
    </SlideDetail>;
}

async function onFocusedListener(addressId: string | undefined, getCurrentPosition: (map?: Map) => Promise<{ position?: Address; error?: GeolocationPositionError }>, mapRef: React.MutableRefObject<Map | undefined>, setAddress: (address: Address | undefined) => void, addresses: Address[]) {
    if (isEmptyText(addressId)) {
        const {position, error} = await getCurrentPosition(mapRef.current);
        if (error) {
            console.warn(error);
            return;
        }
        setAddress(position);
        return;
    }
    const address = addresses.find(a => a.id === addressId);
    if (address && mapRef.current) {
        setAddress(address);
        const latLng = {
            lat: address.lat,
            lng: address.lng
        };
        mapRef.current.flyTo(latLng, 18);
    }
}

export function DeliveryLocationPage(props: RouteProps) {

    const id = useId();
    const mapId = `${id}-map`;
    const mapContentId = `${id}-content`;
    const mapPopupId = `${id}-popup`;
    const addressId = props.params.get('addressId');
    const {appDimension} = useAppDimension();
    const {showSlidePanel, store: appStore} = useAppContext();

    const mapIdHeightRef = useRef(appDimension.height - 37 - 122);
    const [address, setAddress] = useState<Address | undefined>({
        id: '',
        lat: 0,
        lng: 0,
        location: 'Home',
        buildingOrPremiseName: '',
        landmark: '',
        houseOrFlatNo: '',
        areaOrStreetName: ''
    });
    const [mapIsReady, setMapIsReady] = useState(false);
    const getCurrentPosition = useCurrentPosition();
    const addresses = useStoreValue(appStore, s => s.addresses);

    useEffect(() => {
        if (!mapIsReady) {
            return;
        }
        const hasAddress = !isEmptyText(addressId);
        const hasAddressesArray = addresses && addresses.length > 0;
        if (hasAddress) {
            if (hasAddressesArray) {
                onFocusedListener(addressId, getCurrentPosition, mapRef, setAddress, addresses);
            }
        } else {
            (async () => {
                setAddress(undefined);
                await onFocusedListener(addressId, getCurrentPosition, mapRef, setAddress, addresses);
            })();
        }
        // eslint-disable-next-line
    }, [addresses, addressId, mapIsReady])

    useEffect(() => {
        mapIdHeightRef.current = document.getElementById(mapId)?.offsetHeight ?? mapIdHeightRef.current;
    }, [mapId]);
    const mapRef = useRef<Map>();
    usePatchBugInLeaflet();
    useEffect(() => {
        const div = document.getElementById(mapId);
        invariant(div);
        div.innerHTML = `<div id="${mapContentId}" style="height:100%;width:100%;display: flex;flex-direction: column;z-index: 0"/>`;
        const map: Map = createMap(mapContentId).setView({lat: 25.2048, lng: 55.2708}, 12);
        mapRef.current = map;

        function onDragEnd() {
            const popup = document.getElementById(mapPopupId);
            if (popup) {
                popup.style.opacity = '1';
            }
        }

        function onDragMove() {
            const popup = document.getElementById(mapPopupId);
            if (popup) {
                popup.style.opacity = '0';
            }
        }

        async function onDragMoveEnd() {
            const popup = document.getElementById(mapPopupId);
            if (popup) {
                popup.style.opacity = '1';
                const latLon = map.getCenter();
                const address = await getLocationAddress(latLon);
                setAddress(produce((s: Address | undefined) => {
                    if (s) {
                        s.lat = latLon.lat;
                        s.lng = latLon.lng;
                        s.buildingOrPremiseName = address.name;
                        s.areaOrStreetName = address.displayName.replace(address.name + ', ', '');
                    }
                }));
            }
        }

        map.addEventListener('dragend', onDragEnd);
        map.addEventListener('move', onDragMove);
        map.addEventListener('moveend', onDragMoveEnd)
        const tileLayer = createTile('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {});
        tileLayer.addTo(map);
        setMapIsReady(true);
        return () => {
            map.removeEventListener('dragend', onDragEnd);
            map.removeEventListener('move', onDragMove);
            map.removeEventListener('moveend', onDragMoveEnd)
            map.remove();
            div.innerHTML = '';
        }
        // eslint-disable-next-line
    }, [id]);

    const buildingName = ((address?.buildingOrPremiseName ?? '').substring(0, 25) + ((address?.buildingOrPremiseName ?? '').length > 25 ? '...' : ''));
    const addressName = ((address?.areaOrStreetName ?? '').substring(0, 65) + ((address?.areaOrStreetName ?? '').length > 65 ? '...' : ''));
    return <Page>
        <Header title={'Choose delivery location'}/>
        <div style={{
            height: '100%',
            width: appDimension.width,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <div id={mapId}
                 style={{height: '100%', width: appDimension.width, display: 'flex', flexDirection: 'column'}}/>
            <Visible if={!isNullOrUndefined(address)}>
                <motion.div style={{
                    width: 40,
                    height: 40,
                    position: 'absolute',
                    left: (appDimension.width / 2) - 20,
                    top: ((mapIdHeightRef.current) / 2) - 40,
                }} initial={{y: -100}} animate={{y: 0}} transition={{duration: 2}}>
                    <IoLocation style={{fontSize: 40, color: red}}/>
                    <div style={{
                        position: 'absolute',
                        backgroundColor: '#333',
                        color: 'white',
                        width: 220,
                        fontSize: 13,
                        left: -90,
                        top: -60,
                        padding: 10,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 10,
                        transition: 'opacity 100ms ease-in-out'
                    }} id={`${id}-popup`}>
                        <div style={{marginBottom: 5}}>Your order will be delivered here</div>
                        <div style={{fontSize: 11}}>Move pin to your exact location</div>
                    </div>
                </motion.div>
            </Visible>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 20px',
            height: 122,
            flexGrow: 0,
            flexShrink: 0,
            boxSizing: 'border-box'
        }}>
            <div style={{display: 'flex', flexGrow: 1}}>
                <IoLocation fontSize={25} style={{marginRight: 10}}/>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <SkeletonBox skeletonVisible={buildingName === ''}
                                 style={{height: 13, marginBottom: 5, marginRight: 10}}>
                        <div style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>{buildingName}</div>
                    </SkeletonBox>
                    <SkeletonBox skeletonVisible={addressName === ''} style={{height: 13, marginRight: 10}}>
                        <div>{addressName}</div>
                    </SkeletonBox>
                </div>
                <motion.div style={{color: red}} whileTap={{scale: 0.95}}>
                    Change
                </motion.div>
            </div>
            <Button title={'Enter complete address'} onTap={async () => {
                let completeAddress = await showSlidePanel(closePanel => {
                    return <AddressSlidePanel closePanel={closePanel} address={address}/>
                });
                if (completeAddress === false) {
                    return;
                }
                window.history.back();

            }} theme={ButtonTheme.danger} icon={IoLocation}/>
        </div>
    </Page>
}

function usePatchBugInLeaflet() {
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow
    });
}


