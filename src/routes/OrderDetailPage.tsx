import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {Store, useStore, useStoreValue} from "../components/store/useStore";
import {CartItem} from "./DeliveryPage";
import {Card, CardRow, CardTitle} from "../components/page-components/Card";
import {useFocusListener} from "../components/RouterPageContainer";
import {RouteProps} from "../components/useRoute";
import {IoAddOutline, IoDisc, IoDocumentOutline} from "react-icons/io5";
import {AddToCartButton} from "../components/page-components/AddToCartButton";
import {useNavigate} from "../components/useNavigate";
import {RxLapTimer} from "react-icons/rx";
import {CiDiscount1} from "react-icons/ci";
import {useAppContext} from "../components/useAppContext";

export function calculateCartItemPrice(cart: CartItem): number {
    const total = cart.product.price + cart.options.reduce((total, configOption) => {
        return total + configOption.price;
    }, 0);
    return total;
}

export function CardItemDetail(props: { cart: CartItem, shoppingCart: Store<CartItem[]> }) {
    const {cart, shoppingCart} = props;
    return <div style={{display: 'flex', padding: '5px 10px', marginBottom: 15, justifyContent: 'center'}}>
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
                <AddToCartButton shoppingCart={shoppingCart} product={cart.product} options={cart.options}
                                 size={'small'}/>
            </div>
            <div style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: 14,
                marginTop: 5
            }}>{cart.product.currency} {cart.totalPrice}</div>
        </div>
    </div>;
}

export default function OrderDetailPage(props: RouteProps) {
    const shoppingCart = useStore<CartItem[]>(() => {
        const orderDetail = JSON.parse(localStorage.getItem('order-detail') ?? '');
        return orderDetail;
    });
    useFocusListener(props.path, () => {
        const orderDetail = JSON.parse(localStorage.getItem('order-detail') ?? '');
        shoppingCart.setState(orderDetail);
    });
    const cartItems = useStoreValue(shoppingCart, s => s);
    const navigate = useNavigate();
    const {appDimension} = useAppContext();
    return <Page style={{backgroundColor: '#F2F2F2'}}>
        <Header title={'Order Details'}/>
        <div style={{display: 'flex', flexDirection: 'column', padding: 10, height: '100%', overflow: 'auto',paddingBottom:100}}>
            <Card style={{marginBottom: 10}}>
                <div style={{display: 'flex', flexDirection: 'row', padding: '5px 10px', fontSize: 15}}>
                    <div><RxLapTimer/></div>
                    <div style={{marginLeft: 10, marginBottom: 2}}>Delivery in 30 - 40 mins</div>
                </div>
            </Card>
            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Your Order'}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {
                        cartItems.map((cart, index) => {
                            return <CardItemDetail cart={cart} shoppingCart={shoppingCart} key={index}/>
                        })
                    }
                    <CardRow title={'Add more items'} icon={IoAddOutline} onTap={() => {
                        navigate('delivery');
                    }}/>
                    <CardRow title={'Add cooking instruction'} icon={IoDocumentOutline} onTap={() => {
                    }}/>
                </div>
            </Card>

            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Discount'}/>
                <CardRow title={'Use Coupons'} icon={CiDiscount1}></CardRow>
            </Card>
            <Card style={{marginBottom: 10}}>
                <CardTitle title={'Bill Summary'}/>
                <div style={{display: 'flex', flexDirection: 'column',padding:'0px 10px'}}>
                    <div style={{display: 'flex',marginBottom:5}}>
                        <div style={{flexGrow: 1}}>Item total</div>
                        <div>AED 11.50</div>
                    </div>
                    <div style={{display: 'flex',marginBottom:5}}>
                        <div style={{flexGrow: 1}}>Delivery charge</div>
                        <div>AED 6</div>
                    </div>
                    <div style={{display: 'flex',marginBottom:5}}>
                        <div style={{flexGrow: 1}}>Tip for delivery partner</div>
                        <div>AED 3</div>
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 20,
                        paddingTop:10,
                        fontWeight: 'bold',
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <div style={{flexGrow: 1}}>Grand Total</div>
                        <div>AED 20.50</div>
                    </div>
                </div>
            </Card>
        </div>
        <div style={{position:'absolute',bottom:0,width:appDimension.width,backgroundColor:'white'}}>

        </div>
    </Page>
}