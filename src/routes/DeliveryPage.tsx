import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoChevronDown, IoDisc, IoHeartOutline} from "react-icons/io5";
import {blue, red, white} from "./Theme";
import {MdPlace} from "react-icons/md";
import {motion} from "framer-motion";
import {CgProfile} from "react-icons/cg";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useEffect, useId, useRef} from "react";
import {StoreValue, useStore} from "../components/store/useStore";
import {useCurrentPosition} from "../components/page-components/utils/useCurrentPosition";
import {Address} from "../model/Address";
import {EMPTY_ADDRESS} from "./DeliveryLocationPage";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {Product} from "../model/Product";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {ValueOnChangeProperties} from "../components/page-components/picker/createPicker";
import produce from "immer";

function AddressHeader(props: { address?: Address }) {
    let {address} = props;
    address = address ?? EMPTY_ADDRESS;
    let addressText = address.areaOrStreetName;
    addressText = addressText.substring(0, 40) + (addressText.length > 40 ? '...' : '');
    return <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%'}}>
        <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <SkeletonBox skeletonVisible={address.buildingOrPremiseName === ''}
                         style={{height: 13, width: 100, marginBottom: 3}}>
                <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 3}}>{address.buildingOrPremiseName}</div>
            </SkeletonBox>
            <div style={{marginLeft: 3, marginBottom: 2}}>
                <IoChevronDown/>
            </div>
        </div>
        <SkeletonBox skeletonVisible={addressText === ''} style={{height: 15}}>
            <div style={{
                textOverflow: 'ellipsis',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{addressText}
            </div>
        </SkeletonBox>
    </div>
}

function AddProductToCart(props: ValueOnChangeProperties<number>) {
    const {value,onChange} = props;
    invariant(onChange);
    const hasValue = value > 0;
    return <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: -20,
        zIndex: 0,
        boxSizing: 'border-box'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: 100,
            height: 35,
            backgroundColor: red,
            color: white,
            borderRadius: 10,
            alignItems: 'center'
        }}>
            <div style={{display: 'flex',width:'100%',height:'100%',position:"relative"}}>
                <motion.div style={{width:'50%',padding:5}} whileTap={{scale:0.9}} onTap={() => {
                    onChange(hasValue?value-1:1);
                }} animate={{opacity:hasValue?1:0}}>
                    <IoMdRemove fontSize={20}/>
                </motion.div>
                <div style={{
                    position:'absolute',
                    fontSize: 16,
                    lineHeight: 1,
                    textAlign:'center',
                    fontWeight: 'bold',
                    width: 50,
                    left:24,
                    top : 8
                }} onClick={() => {
                    if(!hasValue){
                        onChange(hasValue?value+1:1);
                    }
                }}>{hasValue ? value : 'ADD'}
                </div>
                <motion.div style={{width:'50%',textAlign:'right',padding:5}} whileTap={{scale:0.9}} onTap={() => {
                    onChange(hasValue?value+1:1);
                }} animate={{opacity:hasValue?1:0}}>
                    <IoMdAdd fontSize={20}/>
                </motion.div>
            </div>
        </div>
        {/*<Button title={'Add'} style={{backgroundColor: veryLightRed}} onTap={() => {*/}
        {/*}} icon={IoAdd} theme={ButtonTheme.danger}/>*/}
    </div>;
}
interface CartItem{
    productId:string,
    total:number
}

export function DeliveryPage(props: RouteProps) {

    const {appDimension} = useAppContext();
    const navigate = useNavigate();
    const componentId = useId();
    const titleRef = useRef<{ title: string, offsetY: number }[]>([]);
    const selectedTitle = useStore('');
    const getCurrentPosition = useCurrentPosition();
    const positionStore = useStore<Address>(EMPTY_ADDRESS);
    const shoppingCart = useStore<CartItem[]>([]);
    useEffect(() => {
        (async () => {
            const {position} = await getCurrentPosition();
            if (position) {
                positionStore.setState(position);
            }
        })();
        // eslint-disable-next-line
    }, [])
    return <Page style={{paddingTop: 130, paddingBottom: 80, backgroundColor: '#F2F2F2'}} onScroll={(event) => {

        const target = event.target;
        const scrollTop = (target as HTMLDivElement).scrollTop;
        const titleDiv = document.getElementById(`${componentId}-title`);
        const header = document.getElementById(`${componentId}-header`);
        const nonVegButton = document.getElementById(`${componentId}-nonveg-button`);
        const vegButton = document.getElementById(`${componentId}-veg-button`);
        invariant(titleDiv);
        invariant(header);
        invariant(nonVegButton);
        invariant(vegButton);
        const titleArray = titleRef.current.filter(title => title.offsetY <= scrollTop);
        const title = titleArray[titleArray.length - 1].title;
        if (selectedTitle.stateRef.current !== title) {
            selectedTitle.setState(title);
        }
        if (scrollTop > 10) {
            header.style.backgroundColor = '#FFF';
            nonVegButton.style.border = '1px solid rgba(0,0,0,0.1)';
            vegButton.style.border = '1px solid rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = '#F2F2F2';
            nonVegButton.style.border = '1px solid rgba(0,0,0,0)';
            vegButton.style.border = '1px solid rgba(0,0,0,0)';
        }

        if (scrollTop > 18) {
            titleDiv.style.display = 'flex';
        } else {
            titleDiv.style.display = 'none';
        }
    }}>

        {menus.map((menu) => {
            return <Card key={menu.id} style={{marginBottom: 20}}>
                <CardTitle title={`${menu.name} (${menu.productId.length})`} onMounted={(param) => {
                    const value = {title: param.title, offsetY: param.dimension.y - 200};
                    titleRef.current.push(value);
                    return () => {
                        titleRef.current = titleRef.current.filter(p => p !== value);
                    }
                }}/>
                {menu.productId.map((productId) => {
                    const product = products.find(p => p.id === productId);
                    invariant(product);
                    const description = product.description.substring(0, 75);
                    return <div key={productId} style={{
                        display: 'flex',
                        padding: 10,
                        marginBottom: 20,
                        borderBottom: '1px dashed rgba(0,0,0,0.1)'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{fontSize: 20, marginBottom: 5}}><IoDisc/></div>
                            <div style={{fontSize: 16, fontWeight: 'bold', marginBottom: 15}}>{product.name}</div>
                            <div style={{fontWeight: 'bold', marginBottom: 10}}>{product.currency} {product.price}</div>
                            <div style={{marginBottom: 10}}>
                                {description}
                                <span style={{fontWeight: 'bold'}}>{'...Read More'}</span>
                            </div>
                            <div style={{fontSize: 25}}><IoHeartOutline/></div>
                        </div>
                        <div style={{position: 'relative', marginLeft: 20}}>
                            <div style={{
                                width: 130, height: 130,
                                borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)',
                                flexShrink: 0, flexGrow: 0,
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}>
                                <img src={process.env.PUBLIC_URL + product.imageAddress} width={130} height={130}
                                     style={{
                                         width: 130,
                                         height: 130,
                                         marginBottom: -5,
                                         flexShrink: 0,
                                         flexGrow: 0,
                                         backgroundColor: 'rgba(0,0,0,0.1)'
                                     }} alt={'product'}/>
                            </div>
                            <StoreValue store={shoppingCart} selector={s => {
                                return s.find(t => t.productId === productId)?.total ?? 0;
                            }} property={'value'}>
                                <AddProductToCart onChange={(value) => {
                                    shoppingCart.setState(produce(s => {
                                        const currentIndex = s.findIndex(s => s.productId === productId);
                                        if(currentIndex >= 0){
                                            s[currentIndex].total = value;
                                        }else{
                                            s.push({productId,total:value})
                                        }
                                    }));
                                }}/>
                            </StoreValue>

                        </div>

                    </div>
                })}
            </Card>
        })}

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            width: appDimension.width,
            backgroundColor: '#F2F2F2',
            transition: 'background-color 200ms cubic-bezier(0,0,0.7,0.9)'
        }} id={`${componentId}-header`}>
            <div style={{
                display: 'flex',
                flexWrap: 'nowrap',
                boxSizing: 'border-box',
                padding: 10
            }}>
                <div style={{fontSize: 30, marginRight: 5}}>
                    <MdPlace/>
                </div>
                <StoreValue store={positionStore} selector={p => p} property={'address'}>
                    <AddressHeader/>
                </StoreValue>
                <motion.div style={{fontSize: 35, width: 35, flexShrink: 0, marginLeft: 5}} whileTap={{scale: 0.9}}
                            onTap={() => {
                                navigate('account');
                            }}>
                    <CgProfile/>
                </motion.div>
            </div>
            <div style={{display: 'flex', marginBottom: 10, padding: '0 10px'}}>
                <div style={{
                    marginBottom: 5,
                    color: 'green',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 10,
                    boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10,
                    marginRight: 10
                }} id={`${componentId}-veg-button`}><IoDisc style={{fontSize: 20, marginRight: 5}}/>
                    <div style={{fontWeight: 'bold', fontSize: 16}}>Veg</div>
                </div>
                <div style={{
                    marginBottom: 5,
                    color: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 10,
                    boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10
                }} id={`${componentId}-nonveg-button`}><IoDisc style={{fontSize: 20, marginRight: 5}}/>
                    <div style={{fontWeight: 'bold', fontSize: 16}}>Non-Veg</div>
                </div>
            </div>
            <div id={`${componentId}-title`} style={{
                display: 'none',
                flexDirection: 'column',
                boxShadow: '0 7px 10px -5px rgba(0,0,0,0.3)',
                background: 'white',
            }}>
                <StoreValue store={selectedTitle} property={'title'} selector={s => s}>
                    <CardTitle/>
                </StoreValue>
            </div>
        </div>
    </Page>
}