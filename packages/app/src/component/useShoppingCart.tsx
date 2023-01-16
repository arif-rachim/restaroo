import {CartItem} from "../routes/DeliveryPage";
import {
    Card,
    CardTitle,
    pageBackgroundColor,
    StoreValue,
    useAppContext,
    useAppStore,
    useStoreValue,
    Value
} from "@restaroo/lib";
import produce from "immer";
import {Product, ProductConfigOption} from "../model/Product";
import invariant from "tiny-invariant";
import {ProductDetail} from "./AddToCartButton";
import {useEffect} from "react";
import {SlideDetail} from "../routes/SlideDetail";
import {CardItemDetail} from "../routes/OrderDetailPage";
import {AppState} from "./AppState";


function optionsToString(options?: ProductConfigOption[]) {
    if (options === undefined) {
        return '';
    }
    return options.map(o => o.name).sort().join(';')
}

export function useShoppingCart() {
    const store = useAppStore<AppState>();
    const openDetail = useDetailPage();
    const openProductRemoval = useRemoveDetail();

    /**
     * This function will add product to cart, first it will open the product detail,allowing user to choose the
     * options and the product that they want it, and then it will add to shopping cart accordingly.
     * @param product
     */
    async function addProductToCart(product: Product) {
        const cartItem = await openDetail(product);
        if (cartItem === false) {
            return;
        }

        store.set(produce((s) => {
            const existingCartItem = s.shoppingCart.find(c => c.product.id === cartItem.product.id && optionsToString(c.options) === optionsToString(cartItem.options));
            if (existingCartItem) {
                existingCartItem.total = existingCartItem.total + cartItem.total;
                existingCartItem.totalPrice = existingCartItem.totalPrice + cartItem.totalPrice;
            } else {
                s.shoppingCart.push(cartItem);
            }
        }));
    }

    function getTotalItemsInCart() {
        return store.get().shoppingCart.reduce((total, c) => (total + c.total), 0);
    }

    /**
     * This function will check, if the product that wants to be added into card does not have any options selected
     * but the product itself have the options available, then we will prompt add to product detail allowing user to add
     * like normal. How ever if the product does not have config and options are empty, then we will proceed
     * by adding the product into cart directly.
     * But if we pass options, that means we want to add more to the cart, then this function will find the matching
     * items in the cart, and add 1 to the cart.
     * @param options
     * @param product
     */
    async function addItemToCartByProductAndOptions(options: ProductConfigOption[], product: Product) {
        if (options.length === 0) {
            if (product.configs.length > 0) {
                await addProductToCart(product);
            } else {
                store.set(produce((s) => {
                    const existingCartItem = s.shoppingCart.find(c => c.product.id === product.id);
                    if (existingCartItem) {
                        existingCartItem.total = existingCartItem.total + 1;
                        existingCartItem.totalPrice = existingCartItem.total * product.price;
                    } else {
                        s.shoppingCart.push({
                            product,
                            total: 1,
                            options: [],
                            totalPrice: product.price
                        })
                    }
                }));
            }
        } else {
            store.set(produce((s) => {
                const existingCartItem = s.shoppingCart.find(c => c.product.id === product.id && optionsToString(c.options) === optionsToString(options));
                if (existingCartItem) {
                    existingCartItem.totalPrice = (existingCartItem.totalPrice / existingCartItem.total) * (existingCartItem.total + 1);
                    existingCartItem.total = existingCartItem.total + 1;
                }
            }));
        }
    }

    async function removeItemFromCartByProductAndOptions(options: ProductConfigOption[], product: Product) {
        if (options.length === 0) {
            const index = store.get().shoppingCart.findIndex(c => c.product.id === product.id);
            if (index < 0) {
                await addItemToCartByProductAndOptions(options, product);
                return;
            }
            if (product.configs.length > 0) {
                await openProductRemoval(product);
            } else {
                store.set(produce((s) => {
                    const index = s.shoppingCart.findIndex(c => c.product.id === product.id);
                    const existingCartItem = s.shoppingCart[index];
                    invariant(existingCartItem);
                    if (existingCartItem.total > 1) {
                        existingCartItem.total = existingCartItem.total - 1;
                        existingCartItem.totalPrice = existingCartItem.total * product.price;
                    } else {
                        s.shoppingCart.splice(index, 1);
                    }
                }));
            }
        } else {
            store.set(produce((s) => {
                const index = s.shoppingCart.findIndex(c => c.product.id === product.id && optionsToString(c.options) === optionsToString(options));
                const existingCartItem = s.shoppingCart[index];
                if (existingCartItem.total > 1) {
                    existingCartItem.totalPrice = (existingCartItem.totalPrice / existingCartItem.total) * (existingCartItem.total - 1);
                    existingCartItem.total = existingCartItem.total - 1;
                } else {
                    s.shoppingCart.splice(index, 1);
                }
            }));
        }
    }

    return {
        addProductToCart,
        getTotalItemsInCart,
        addItemToCartByProductAndOptions,
        removeItemFromCartByProductAndOptions
    }
}

export function ShoppingCartTotalItem() {
    const store = useAppStore<AppState>();
    return <StoreValue store={store} selector={s => {
        const total = s.shoppingCart.reduce((total, cartItem: CartItem) => (total + cartItem.total), 0);
        return total + ' item' + (total > 1 ? 's' : '')
    }} property={'value'}>
        <Value/>
    </StoreValue>
}

export function ShoppingCartTotalPrice() {
    const store = useAppStore<AppState>();
    return <StoreValue store={store} selector={s => {
        const total = s.shoppingCart.reduce((total, cartItem: CartItem) => (total + cartItem.totalPrice), 0);
        return 'AED ' + total
    }} property={'value'}>
        <Value/>
    </StoreValue>
}


export function useDetailPage(): (product: Product) => Promise<CartItem | false> {
    const {showSlidePanel} = useAppContext();
    return (product: Product) => new Promise(resolve => {
        (async () => {
            const result = await showSlidePanel(closePanel => {
                return <ProductDetail product={product} closePanel={closePanel} total={1}/>
            });
            if (result === false) {
                resolve(false);
                return;
            }
            const cartItem = (result as { product: Product, total: number, totalPrice: number, options: ProductConfigOption[] });
            resolve(cartItem)
        })()
    });
}


function useRemoveDetail() {
    const {showSlidePanel} = useAppContext();
    return async function openRemoveDetail(product: Product) {
        await showSlidePanel(closePanel => {
            return <CartItemSlidePanel product={product} closePanel={closePanel}/>;
        })
    }
}


function CartItemSlidePanel(props: { product: Product, closePanel: (val: any) => void }) {
    const {product, closePanel} = props;
    const store = useAppStore<AppState>();
    const cartItems: CartItem[] = useStoreValue(store, s => s.shoppingCart.filter(s => s.product.id === product.id), [product.id]);
    const totalCartItems = cartItems.length;
    useEffect(() => {
        if (totalCartItems === 0) {
            closePanel(false);
        }
    }, [totalCartItems, closePanel]);
    return <SlideDetail closePanel={closePanel} style={{backgroundColor: pageBackgroundColor, padding: 0}}>
        <Card>
            <CardTitle title={product.name}/>
            {
                cartItems.map((cart, index) => {
                    return <CardItemDetail cart={cart} key={index}/>
                })
            }
        </Card>
    </SlideDetail>
}