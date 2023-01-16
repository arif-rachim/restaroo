import {Page} from "./Page";
import {
    Address,
    Card,
    CardRow,
    CardTitle,
    GuestAddress,
    Header,
    pageBackgroundColor,
    pageColor,
    red,
    RouteProps,
    StoreValue,
    StoreValueRenderer,
    useAddress,
    useAppStore,
    useFocusListener,
    useNavigate,
    useStore,
    Value
} from "@restaroo/lib";
import {CartItem} from "./DeliveryPage";
import {IoAddOutline, IoCaretForward, IoCaretUp, IoDisc, IoDocumentOutline, IoLocation} from "react-icons/io5";
import {AddToCartButton} from "../component/AddToCartButton";
import {TbDiscount} from "react-icons/tb";
import {RiMastercardLine} from "react-icons/ri";
import {useDeliveryChargeCalculator} from "../component/useDeliveryChargeCalculator";
import {AnimatePresence, motion} from "framer-motion";
import {useRef} from "react";
import {AppState} from "../component/AppState";

export function calculateCartItemPrice(cart: CartItem): number {
    return cart.product.price + cart.options.reduce((total, configOption) => {
        return total + configOption.price;
    }, 0);
}


export function CardItemDetail(props: { cart: CartItem }) {
    const {cart} = props;

    return <motion.div style={{display: 'flex', padding: '5px 10px', marginBottom: 15, justifyContent: 'center'}}>
        <div>
            <IoDisc style={{fontSize: 16}}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, marginLeft: 10}}>
            <div style={{fontSize: 16, marginBottom: 5}}>{cart.product.name}</div>
            <div>{cart.options.map(o => o.name).join(', ')}</div>
            <div style={{fontWeight: 'bold'}}>{cart.product.currency} {calculateCartItemPrice(cart)}</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div>
                <AddToCartButton product={cart.product} options={cart.options}
                                 size={'small'}/>
            </div>
            <div style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: 14,
                marginTop: 5
            }}>{cart.product.currency} {cart.totalPrice}</div>
        </div>
    </motion.div>;
}

const tipsDataProvider = [2, 4, 8]
export function OrderDetailPage(props: RouteProps) {
    const store = useAppStore<AppState>();
    // const {store:st} = useAppContext();
    // const store:Store<AppState> = st as any;
    const navigate = useNavigate();
    const deliveryCharge = useDeliveryChargeCalculator();
    const tipsStore = useStore(tipsDataProvider[0]);
    const {getNearestAddress} = useAddress();
    const nearestAddressStore = useStore<Address>(GuestAddress);
    useFocusListener(props.path, () => {
        (async () => {
            const address: Address = await getNearestAddress();
            nearestAddressStore.setState(address);
        })();
    })
    const headerRef = useRef<{ showShadow: (param: boolean) => void }>();
    return <Page style={{backgroundColor: pageBackgroundColor, position: 'relative'}}>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 10,
            height: '100%',
            overflow: 'auto',
            paddingBottom: 150,
            paddingTop: 50,
        }} onScroll={(event) => {
            headerRef.current?.showShadow((event.target as HTMLDivElement).scrollTop > 10)
        }}>
            <Card style={{marginBottom: 10}}>
                <div style={{display: 'flex', flexDirection: 'row', padding: '5px 10px', fontSize: 15}}>
                    <div></div>
                    <div style={{marginLeft: 10, marginBottom: 2}}>Delivery in 30 - 40 mins</div>
                </div>
            </Card>

            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Your Order'}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <StoreValueRenderer store={store} selector={s => s.shoppingCart}
                                        render={(cartItems: CartItem[]) => {
                                            return <AnimatePresence>
                                                {
                                                    cartItems.map((cart, index) => {
                                                        return <CardItemDetail cart={cart} key={index}/>
                                                    })
                                                }
                                            </AnimatePresence>
                                        }}/>
                    <CardRow title={'Add more items'} icon={IoAddOutline} onTap={() => {
                        navigate('delivery');
                    }}/>
                    <CardRow title={'Add cooking instruction'} icon={IoDocumentOutline} onTap={() => {
                    }}/>

                </div>
            </Card>
            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Discount'}/>
                <CardRow title={'Use Coupons'} icon={TbDiscount}></CardRow>
            </Card>
            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Tips for Delivery Partner'}/>
                <div style={{display: 'flex', padding: '0px 10px'}}>
                    <StoreValueRenderer store={tipsStore} selector={s => s} render={(selectedTips) => {

                        return <>{tipsDataProvider.map(tip => {
                            const selected = tip === selectedTips;
                            return <motion.div key={tip}
                                               style={{
                                                   padding: '5px 10px',
                                                   borderRadius: 5,
                                                   marginRight: 10,
                                                   boxShadow: '0 3px 5px -3px rgba(0,0,0,0.2)',
                                                   fontSize: 14,
                                                   backgroundColor: selected ? red : pageColor,
                                                   color: selected ? pageColor : red,
                                                   border: `1px solid ${red}`,
                                               }}
                                               whileTap={{scale: 0.95}}
                                               onClick={() => {
                                                   tipsStore.setState(tip)
                                               }}
                            >AED {tip}</motion.div>
                        })}
                        </>
                    }}/>


                </div>

            </Card>
            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Bill Summary'}/>
                <div style={{display: 'flex', flexDirection: 'column', padding: '0px 10px'}}>
                    <div style={{display: 'flex', marginBottom: 5}}>
                        <div style={{flexGrow: 1}}>Item total</div>
                        <div style={{marginRight: 5}}>AED</div>
                        <StoreValue store={store}
                                    selector={(s) => s.shoppingCart.reduce((total, item) => total + item.totalPrice, 0)}
                                    property={'value'}>
                            <Value/>
                        </StoreValue>
                    </div>
                    <div style={{display: 'flex', marginBottom: 5}}>
                        <div style={{flexGrow: 1}}>Delivery charge</div>
                        <div>AED {deliveryCharge}</div>
                    </div>
                    <div style={{display: 'flex', marginBottom: 5}}>
                        <div style={{flexGrow: 1}}>Tip for delivery partner</div>
                        <StoreValueRenderer store={tipsStore} selector={s => s} render={(tip:number) => {
                            return <div>AED {tip}</div>
                        }}/>

                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 20,
                        paddingTop: 10,
                        fontWeight: 'bold',
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <div style={{flexGrow: 1}}>Grand Total</div>
                        <StoreValueRenderer store={store}
                                            selector={(s) => s.shoppingCart.reduce((total, item) => total + item.totalPrice, 0)}
                                            render={(total:number) => {
                                                return <StoreValueRenderer store={tipsStore} selector={s => s}
                                                                           render={(tip:number) => {
                                                                               return <div>AED {total + tip + deliveryCharge}</div>
                                                                           }}/>
                                            }}/>

                    </div>
                </div>
            </Card>
        </div>
        <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 0 5px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
        }}>
            <div style={{display: 'flex', padding: 10, marginBottom: 10, borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
                <div style={{marginRight: 5}}><IoLocation/></div>
                <div style={{display: 'flex', flexGrow: 1, overflow: 'auto', flexDirection: 'column', marginRight: 5}}>
                    <StoreValue store={nearestAddressStore} selector={s => `Delivery at ${s?.location}`}
                                property={'value'}>
                        <Value style={{marginBottom: 5}}/>
                    </StoreValue>
                    <StoreValue store={nearestAddressStore}
                                selector={(s: Address) => `${s?.areaOrStreetName}, ${s?.houseOrFlatNo}, ${s?.buildingOrPremiseName}, ${s?.landmark}`}
                                property={'value'}>
                        <Value style={{
                            textOverflow: 'ellipsis',
                            width: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}/>
                    </StoreValue>

                </div>
                <motion.div style={{color: red}} whileTap={{scale: 0.95}} onTap={() => {
                    navigate('address-book');
                }}>Change
                </motion.div>
            </div>
            <div style={{display: 'flex', padding: 10}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: 5}}><RiMastercardLine style={{fontSize: 16}}/></div>
                        <div style={{marginRight: 5, marginBottom: 3}}>Pay Using</div>
                        <div><IoCaretUp/></div>
                    </div>
                    <div style={{fontWeight: 'bold'}}>Personal</div>
                    <div>{'****** 8875'}</div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    background: red,
                    color: pageColor,
                    padding: 10,
                    borderRadius: 10,
                    marginLeft: 10,
                    maxWidth: 200
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
                        <StoreValueRenderer store={store}
                                            selector={(s) => s.shoppingCart.reduce((total, item) => total + item.totalPrice, 0)}
                                            render={(total:number) => {
                                                return <StoreValueRenderer store={tipsStore} selector={s => s}
                                                                           render={(tip:number) => {
                                                                               return <div
                                                                                   style={{fontWeight: 'bold'}}>AED {total + tip + deliveryCharge}</div>
                                                                           }}/>
                                            }}/>
                        <div>Total</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        <div style={{fontSize: 16}}>Place Order</div>
                        <div style={{marginLeft: 5}}><IoCaretForward style={{width: 10, height: 10}}/></div>
                    </div>
                </div>
            </div>
        </div>
        <Header title={'Order Details'} floating={true} ref={headerRef}/>
    </Page>
}