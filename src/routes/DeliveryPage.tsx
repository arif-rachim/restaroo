import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoCartOutline, IoChevronDown, IoChevronForward, IoClose, IoDisc, IoHeartOutline} from "react-icons/io5";
import {ButtonTheme, red, white} from "./Theme";
import {MdCheckBox, MdCheckBoxOutlineBlank, MdPlace} from "react-icons/md";
import {motion} from "framer-motion";
import {CgProfile} from "react-icons/cg";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useCallback, useEffect, useId, useRef} from "react";
import {Store, StoreValue, useStore, useStoreValue} from "../components/store/useStore";
import {useCurrentPosition} from "../components/page-components/utils/useCurrentPosition";
import {Address} from "../model/Address";
import {EMPTY_ADDRESS} from "./DeliveryLocationPage";
import {SkeletonBox} from "../components/page-components/SkeletonBox";
import {Product, ProductConfig, ProductConfigOption} from "../model/Product";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {ValueOnChangeProperties} from "../components/page-components/picker/createPicker";
import produce from "immer";
import {Image} from "../components/page-components/Image";
import {SlideDetail} from "./SlideDetail";
import {Button} from "../components/page-components/Button";

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

function AddProductToCart(props: (ValueOnChangeProperties<number> & { mustOpenDetail?: boolean })) {
    const {value, onChange, mustOpenDetail} = props;
    invariant(onChange);
    const hasValue = value > 0;
    return <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        marginTop: -20,
        zIndex: 0,
        boxSizing: 'border-box'
    }} onClick={(event) => {
        if (!mustOpenDetail) {
            event.preventDefault();
            event.stopPropagation();
        }
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
            <div style={{display: 'flex', width: '100%', height: '100%', position: "relative"}}>
                {!mustOpenDetail &&
                    <motion.div style={{width: '50%', padding: 5}} whileTap={{scale: 0.9}} onClick={() => {
                        onChange(hasValue ? value - 1 : 1);
                    }} animate={{opacity: hasValue ? 1 : 0}}>
                        <IoMdRemove fontSize={20}/>
                    </motion.div>
                }
                <div style={{
                    position: 'absolute',
                    fontSize: 16,
                    lineHeight: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    width: 50,
                    left: 24,
                    top: 8
                }} onClick={() => {

                    if (mustOpenDetail) {
                        return;
                    }
                    if (!hasValue) {
                        onChange(hasValue ? value + 1 : 1);
                    }
                }}>{hasValue ? value : 'ADD'}
                </div>
                {!mustOpenDetail &&
                    <motion.div style={{width: '50%', textAlign: 'right', padding: 5}} whileTap={{scale: 0.9}}
                                onClick={() => {

                                    onChange(hasValue ? value + 1 : 1);
                                }} animate={{opacity: hasValue ? 1 : 0}}>
                        <IoMdAdd fontSize={20}/>
                    </motion.div>
                }
            </div>
        </div>
        {mustOpenDetail && <div style={{fontSize: 10, color: 'rgba(0,0,0,0.8)', marginTop: 5}}>{'customizable'}</div>}
    </div>;
}

interface CartItem {
    product: Product,
    total: number,
    totalPrice: number,
    options: ProductConfigOption[]
}

let previousScrollValue = 0;

export function DeliveryPage(props: RouteProps) {

    const {appDimension, showSlidePanel, showFooter, showHeader} = useAppContext();
    const navigate = useNavigate();
    const componentId = useId();
    const titleRef = useRef<{ title: string, offsetY: number }[]>([]);
    const selectedTitle = useStore('');
    const getCurrentPosition = useCurrentPosition();
    const positionStore = useStore<Address>(EMPTY_ADDRESS);
    const shoppingCart = useStore<CartItem[]>([]);
    const pushDownShoppingCartButton = useStore<boolean>(false);
    useEffect(() => {
        (async () => {
            const {position} = await getCurrentPosition();
            if (position) {
                positionStore.setState(position);
            }
        })();
        // eslint-disable-next-line
    }, []);

    return <Page style={{paddingTop: 110, paddingBottom: 110, backgroundColor: '#F2F2F2'}} onScroll={(event) => {
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
            } else {
                showFooter(true);
                pushDownShoppingCartButton.setState(false);
            }
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
                    const isCustomizable = product.config.length > 0
                    return <div key={productId} style={{
                        display: 'flex',
                        padding: 10,
                        marginBottom: 20,
                        borderBottom: `1px dashed rgba(0,0,0,${isLastIndex ? '0' : '0.1'})`
                    }} onClick={async () => {
                        const result = await showSlidePanel(closePanel => {
                            return <ProductDetail product={product} closePanel={closePanel} total={1}/>
                        });
                        if (result === false) {
                            return;
                        }
                        const cartItem = (result as { product: Product, total: number, totalPrice: number, options: ProductConfigOption[] });
                        shoppingCart.setState(items => [...items, cartItem]);
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
                            <StoreValue store={shoppingCart}
                                        selector={s => (s.filter(t => t.product.id === productId)?.reduce((total, item) => total + item.total, 0) ?? 0)}
                                        property={'value'}>
                                <AddProductToCart onChange={(value) => {
                                    shoppingCart.setState(produce(s => {
                                        const currentIndex = s.findIndex(s => s.product.id === productId);
                                        if (currentIndex >= 0) {
                                            s[currentIndex].total = value;
                                        } else {
                                            s.push({
                                                product,
                                                total: value,
                                                totalPrice: value * product.price,
                                                options: []
                                            });
                                        }
                                    }));
                                }} mustOpenDetail={isCustomizable}/>
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
                <motion.div style={{fontSize: 35, width: 35, flexShrink: 0, marginLeft: 5}} whileTap={{scale: 0.9}}
                            onTap={() => {
                                navigate('account');
                            }}>
                    <CgProfile/>
                </motion.div>
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
        <StoreValue store={pushDownShoppingCartButton} selector={s => ({bottom: s ? 0 : 63})} property={'animate'}>
            <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                width: appDimension.width,
                background: white
            }} initial={{bottom: 63}} transition={{bounce:0}}>
                <div style={{
                    display: 'flex',
                    backgroundColor: red,
                    color: white,
                    padding: '10px 20px',
                    margin: '5px 10px',
                    alignItems:'center',
                    borderRadius: 10
                }}>
                    <div style={{display: 'flex', flexDirection: 'column',flexGrow:1}}>
                        <div style={{marginBottom:5}}>1 item</div>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}>
                            <div style={{fontWeight:'bold',fontSize:16}}>AED 29.50</div>
                            <div style={{fontSize: 10, marginLeft: 5, marginBottom: 2}}>inclusive of taxes</div>
                        </div>
                    </div>
                    <div style={{fontSize:16}}>Next</div>
                    <div>
                        <IoChevronForward style={{fontSize:16,marginBottom:-3,marginLeft:5}}/>
                    </div>
                </div>
            </motion.div>
        </StoreValue>
    </Page>
}

function ProductConfigItem(props: { product: Product, option: ProductConfigOption, config: ProductConfig, store: Store<{ total: number, options: ProductConfigOption[] }> }) {
    const {option, store, config, product} = props;
    const isSelected = useStoreValue(store, s => s.options.findIndex(o => o.name === option.name) >= 0, [option.name]);

    return <motion.div key={option.name}
                       style={{display: 'flex', padding: '5px 10px 10px 10px'}}
                       whileTap={{scale: 0.95}}
                       onTap={() => {
                           store.setState(produce((s: { total: number, options: ProductConfigOption[] }) => {
                               const {required, maximumSelection, options} = config;
                               const index = s.options.findIndex(o => o.name === option.name);
                               const alreadySelected = index >= 0;
                               const toBeSelected = !alreadySelected;
                               const toBeRemoved = alreadySelected;
                               const allOptions = config.options;

                               const currentTotalSelected = s.options.reduce((total, optionName) => {
                                   return total + (allOptions.findIndex(o => o.name === optionName.name) >= 0 ? 1 : 0);
                               }, 0);
                               if (toBeSelected && currentTotalSelected < maximumSelection) {
                                   s.options.push(option);
                               }
                               if (toBeSelected && currentTotalSelected === maximumSelection && maximumSelection === 1) {
                                   allOptions.forEach(e => {
                                       const index = s.options.findIndex(o => o.name === e.name);
                                       if (index >= 0) {
                                           s.options.splice(index, 1);
                                       }
                                   })
                                   s.options.push(option);
                               }
                               if (toBeRemoved && (!required) && currentTotalSelected > 0) {
                                   s.options.splice(index, 1);
                               }
                               if (toBeRemoved && required && currentTotalSelected > 0) {
                                   s.options.splice(index, 1);
                               }
                           }))
                       }}>
        <div style={{fontSize: 16, flexGrow: 1, marginLeft: 5}}>{option.name}</div>
        {option.price > 0 &&
            <div style={{fontSize: 16, fontWeight: 'bold'}}>{product.currency} {option.price}</div>
        }
        <div style={{fontSize: 25, color: red, marginLeft: 10, marginTop: -3}}>{isSelected ? <MdCheckBox/> :
            <MdCheckBoxOutlineBlank/>}</div>
    </motion.div>
}

function ProductConfigCard(props: { config: ProductConfig, product: Product, store: Store<{ total: number, options: ProductConfigOption[] }> }) {
    const {config, store, product} = props;
    return <Card key={config.name} style={{margin: 10}}>
        <CardTitle title={config.name}/>
        <div style={{display: 'flex', marginLeft: 15, marginBottom: 10, marginTop: -5}}>
            {config.required &&
                <div style={{marginRight: 5}}>Selection is <span style={{fontWeight: 'bold'}}>required</span>.</div>
            }
            {config.maximumSelection > 1 &&
                <div>Select up to <span style={{fontWeight: 'bold'}}>{config.maximumSelection}</span> options.</div>
            }
        </div>
        <div style={{display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10}}>
            {config.options.map((option) => {
                return <ProductConfigItem option={option} key={option.name} store={store} config={config}
                                          product={product}/>
            })}
        </div>
    </Card>;
}

function ProductDetail(props: { product: Product, closePanel: (result: any) => void, total: number }) {
    const {appDimension, showModal} = useAppContext();
    const {product, closePanel} = props;
    const store = useStore<{ total: number, options: ProductConfigOption[] }>({
        total: props.total || 1,
        options: []
    });
    const validate = useCallback(() => {
        return product.config.filter(c => c.required).map(c => {
            for (const requiredOption of c.options) {
                const isSelected = store.stateRef.current.options.findIndex(o => o.name === requiredOption.name) >= 0;
                if (isSelected) {
                    return '';
                }
            }
            return `Selecting a${['a', 'i', 'u', 'e', 'o'].includes(c.name.substring(0, 1).toLowerCase()) ? 'n' : ''} ${c.name} is required.`
        }).filter(m => m);
    }, [product.config, store.stateRef]);
    return <SlideDetail closePanel={closePanel} style={{backgroundColor: '#F2F2F2', padding: 0}}>
        <div style={{flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
            <Card style={{padding: 0, margin: 10}}>
                <div style={{marginBottom: 10}}>
                    <Image src={process.env.PUBLIC_URL + product.imageAddress} height={appDimension.width - 20}
                           width={appDimension.width - 20}
                           style={{borderRadius: 10}}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', padding: '10px 10px 10px 10px'}}>
                    <IoDisc style={{fontSize: 20, marginRight: 5, color: red, marginBottom: 5}}/>
                    <div style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>{product.name}</div>
                    <div style={{fontSize: 16, marginBottom: 20}}>{product.description}</div>
                </div>
            </Card>
            {product.config.map(config => {
                return <ProductConfigCard config={config} key={config.name} store={store} product={product}/>
            })}
        </div>
        <div style={{display: 'flex', padding: 10, background: white,boxShadow:'0 -7px 8px -5px rgba(0,0,0,0.2)'}}>
            <motion.div style={{
                display: 'flex',
                border: `1px solid ${red}`,
                color: red,
                borderRadius: 10,
                marginRight: 10,
                alignItems: 'center'
            }} whileTap={{scale: 0.98}}>
                <motion.div style={{padding: 10}} whileTap={{scale: 0.95}} onTap={() => {
                    if (store.stateRef.current.total === 1) {
                        closePanel(false);
                        return;
                    }
                    store.setState(produce(s => {
                        s.total = s.total > 1 ? s.total - 1 : 1;
                    }))
                }}>
                    <IoMdRemove style={{fontSize: 20}}/>
                </motion.div>
                <StoreValue store={store} selector={s => s.total} property={'value'}>
                    <Title/>
                </StoreValue>
                <motion.div style={{padding: 10}} onTap={() => {
                    store.setState(produce(s => {
                        s.total = s.total > 0 ? s.total + 1 : 1;
                    }))
                }}>
                    <IoMdAdd style={{fontSize: 20}}/>
                </motion.div>
            </motion.div>
            <StoreValue store={store} property={'title'}
                        selector={s => `Add item - ${product.currency} ${s.total * (product.price + (s.options.reduce((total, option) => (total + option.price), 0)))}`}>
                <Button onTap={async () => {
                    const errors = validate();
                    if (errors.length > 0) {
                        await showModal(closePanel => {
                            return <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 10,
                                background: red,
                                color: 'white',
                                borderRadius: 10
                            }}>
                                {errors.map(error => {
                                    return <div key={error}>{error}</div>
                                })}
                                <div style={{display: 'flex', flexDirection: 'row-reverse', marginTop: 5}}>
                                    <Button onTap={() => {
                                        closePanel(true);
                                    }} title={'Ok'} icon={IoClose} theme={ButtonTheme.danger}
                                            style={{color: 'white', fontSize: 13, padding: '5px 10px'}}
                                            iconStyle={{width: 13, height: 13}}/>
                                </div>
                            </div>
                        })
                        return;
                    }
                    const {total, options} = store.stateRef.current;
                    const totalPrice = total * (product.price + (options.reduce((total, option) => (total + option.price), 0)))
                    closePanel({product, total, totalPrice, options});

                }} style={{flexGrow: 1, backgroundColor: red, color: 'white'}} title={''} icon={IoCartOutline}
                        theme={ButtonTheme.danger} iconStyle={{fontSize: 19}}/>
            </StoreValue>
        </div>
    </SlideDetail>
}

function Title(props: { value?: number }) {
    return <div style={{fontSize: 18, paddingBottom: 3, width: 30, textAlign: 'center', fontWeight: 'bold'}}>
        {props.value}
    </div>
}