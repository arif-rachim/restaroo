import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoChevronDown, IoChevronForward, IoDisc, IoHeartOutline} from "react-icons/io5";
import {red, white} from "./Theme";
import {MdPlace} from "react-icons/md";
import {motion} from "framer-motion";

import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useEffect, useId, useRef} from "react";
import {StoreValue, useStore} from "../components/store/useStore";
import {useCurrentPosition} from "../components/page-components/utils/useCurrentPosition";
import {Address} from "../model/Address";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {Product, ProductConfigOption} from "../model/Product";
import {AddToCartButton} from "../components/page-components/AddToCartButton";
import {GuestAddress} from "../model/Profile";
import {ShoppingCartTotalItem, ShoppingCartTotalPrice, useShoppingCart} from "../model/useShoppingCart";
import {AvatarImage} from "../components/page-components/AvatarImage";

function AddressHeader(props: { address?: Address }) {
    let {address} = props;
    address = address ?? GuestAddress;
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

export interface CartItem {
    product: Product,
    total: number,
    totalPrice: number,
    options: ProductConfigOption[]
}

let previousScrollValue = 0;

const cartButtonPosition = {
    hidden: {bottom: 0,opacity:0},
    low: {bottom: 0,opacity:0},
    high: {bottom: 65,opacity:1}
}

let timeoutId:any = 0;
export function DeliveryPage(props: RouteProps) {
    const {appDimension, showFooter} = useAppContext();
    const navigate = useNavigate();
    const componentId = useId();
    const titleRef = useRef<{ title: string, offsetY: number }[]>([]);
    const selectedTitle = useStore('');
    const getCurrentPosition = useCurrentPosition();
    const positionStore = useStore<Address>(GuestAddress);
    const pushDownShoppingCartButton = useStore<boolean>(true);
    const {addProductToCart,getTotalItemsInCart} = useShoppingCart();
    useEffect(() => {
        (async () => {
            const {position} = await getCurrentPosition();
            if (position) {
                positionStore.setState(position);
            }
        })();
        // eslint-disable-next-line
    }, []);

    return <Page style={{paddingTop: 110, paddingBottom: 70, backgroundColor: '#F2F2F2'}} onScroll={(event) => {
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
        let scrollDown = previousScrollValue < scrollTop;
        previousScrollValue = scrollTop;

        const titleArray = titleRef.current.filter(title => title.offsetY <= scrollTop);
        const title = titleArray[titleArray.length - 1].title;
        if (selectedTitle.stateRef.current !== title) {
            selectedTitle.setState(title);
        }
        if (scrollTop > 5) {
            header.style.backgroundColor = '#FFF';
            nonVegButton.style.border = '1px solid rgba(0,0,0,0.1)';
            vegButton.style.border = '1px solid rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = '#F2F2F2';
            nonVegButton.style.border = '1px solid rgba(0,0,0,0)';
            vegButton.style.border = '1px solid rgba(0,0,0,0)';
        }

        if (scrollTop > 13) {
            titleDiv.style.display = 'flex';
        } else {
            titleDiv.style.display = 'none';
        }

        if (scrollTop >= 400) {
            header.style.transform = `translateY(-110px)`;
            if (scrollDown) {
                showFooter(false);
                pushDownShoppingCartButton.setState(true);
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    clearTimeout(timeoutId);
                    showFooter(true);
                    pushDownShoppingCartButton.setState(false);
                },1000);
            }
            // else {
            //     showFooter(true);
            //     pushDownShoppingCartButton.setState(false);
            // }
        } else {
            header.style.transform = 'translateY(0px)';
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
                {menu.productId.map((productId, index, source) => {
                    const isLastIndex = index === source.length - 1;
                    const product = products.find(p => p.id === productId);
                    invariant(product);
                    const description = product.description.substring(0, 75);
                    return <div key={productId} style={{
                        display: 'flex',
                        padding: 10,
                        marginBottom: 20,
                        borderBottom: `1px dashed rgba(0,0,0,${isLastIndex ? '0' : '0.1'})`
                    }} onClick={async () => await addProductToCart(product)}>
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
                            <AddToCartButton options={[]} product={product} style={{marginTop: -15}}/>
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
            transition: 'background-color 200ms cubic-bezier(0,0,0.7,0.9),transform 200ms cubic-bezier(0,0,0.7,0.9)'
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
                <AvatarImage height={40} width={40} onClick={() => navigate('account')}/>

            </div>
            <div style={{display: 'flex', marginBottom: 5, padding: '0 10px'}}>
                <div style={{
                    marginBottom: 5,
                    color: 'green',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 5,
                    boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10,
                    marginRight: 10
                }} id={`${componentId}-veg-button`}><IoDisc style={{fontSize: 20, marginRight: 5}}/>
                    <div style={{fontWeight: 'bold', fontSize: 13}}>Veg</div>
                </div>
                <div style={{
                    marginBottom: 5,
                    color: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 5,
                    boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10
                }} id={`${componentId}-nonveg-button`}><IoDisc style={{fontSize: 20, marginRight: 5}}/>
                    <div style={{fontWeight: 'bold', fontSize: 13}}>Non-Veg</div>
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
        <StoreValue store={pushDownShoppingCartButton} selector={s => {
            const hidden = getTotalItemsInCart() === 0;
            if (hidden) {
                return cartButtonPosition.hidden;
            } else if (s) {
                return cartButtonPosition.low;
            } else {
                return cartButtonPosition.high;
            }
        }} property={'animate'}>
            <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                width: appDimension.width,
            }} transition={{bounce:0}}>
                <motion.div style={{
                    display: 'flex',
                    backgroundColor: red,
                    color: white,
                    padding: '10px 20px',
                    margin: '5px 10px',
                    alignItems: 'center',
                    boxShadow:'0 5px 5px -3px rgba(0,0,0,0.5)',
                    borderRadius: 10
                }} whileTap={{scale: 0.95}} onTap={() => {
                    navigate('order-detail');
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <div style={{marginBottom: 5}}>
                            <ShoppingCartTotalItem/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}>
                            <div style={{fontWeight: 'bold', fontSize: 16}}>
                                <ShoppingCartTotalPrice/>
                            </div>
                            <div style={{fontSize: 10, marginLeft: 5, marginBottom: 2}}>inclusive of taxes</div>
                        </div>
                    </div>
                    <div style={{fontSize: 16}}>Next</div>
                    <div>
                        <IoChevronForward style={{fontSize: 16, marginBottom: -3, marginLeft: 5}}/>
                    </div>
                </motion.div>
            </motion.div>
        </StoreValue>
    </Page>
}
