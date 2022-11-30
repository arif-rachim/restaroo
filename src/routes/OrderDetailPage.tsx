import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {useStore, useStoreValue} from "../components/store/useStore";
import {CartItem} from "./DeliveryPage";
import {Card, CardTitle} from "../components/page-components/Card";
import {useFocusListener} from "../components/RouterPageContainer";
import {RouteProps} from "../components/useRoute";
import {IoDisc} from "react-icons/io5";
import {AddToCartButton} from "../components/page-components/AddToCartButton";

export default function OrderDetailPage(props:RouteProps) {
    const shoppingCart = useStore<CartItem[]>(() => {
        const orderDetail = JSON.parse(localStorage.getItem('order-detail') ?? '');
        return orderDetail;
    });
    useFocusListener(props.path,() => {
        const orderDetail = JSON.parse(localStorage.getItem('order-detail') ?? '');
        shoppingCart.setState(orderDetail);
    });
    const cartItems = useStoreValue(shoppingCart, s => s);
    return <Page style={{backgroundColor: '#F2F2F2'}}>
        <Header title={'Order Details'}/>
        <div style={{display: 'flex', flexDirection: 'column',padding:10}}>
            <Card>
                <CardTitle title={'Your Order'}/>
                <div style={{display:'flex',flexDirection:'column'}}>
                {
                    cartItems.map((cart, index) => {
                        return <div key={index} style={{display: 'flex',padding:'5px 10px',marginBottom:15,justifyContent:'center'}}>
                            <div>
                                <IoDisc style={{fontSize:16}}/>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column',flexGrow:1,marginLeft:10}}>
                                <div style={{fontSize:16,marginBottom:5}}>{cart.product.name}</div>
                                <div style={{fontWeight:'bold'}}>{cart.product.currency} {cart.product.price}</div>
                            </div>
                            <div style={{display:'flex',flexDirection:'column'}}>
                                <div >
                                    <AddToCartButton shoppingCart={shoppingCart} product={cart.product} size={'small'} />
                                </div>
                                <div style={{fontWeight:'bold',textAlign:'right',fontSize:14,marginTop:5}}>{cart.product.currency} {cart.totalPrice}</div>
                            </div>
                        </div>
                    })
                }
                </div>
            </Card>
        </div>
    </Page>
}