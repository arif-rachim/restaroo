import {ValueOnChangeProperties} from "./picker/createPicker";
import invariant from "tiny-invariant";
import {ButtonTheme, red, white} from "../../routes/Theme";
import {motion} from "framer-motion";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {Store, StoreValue, useStore, useStoreValue} from "../store/useStore";
import {Product, ProductConfig, ProductConfigOption} from "../../model/Product";
import produce from "immer";
import {CartItem} from "../../routes/DeliveryPage";
import {useAppContext} from "../useAppContext";
import {useCallback} from "react";
import {SlideDetail} from "../../routes/SlideDetail";
import {Card, CardTitle} from "./Card";
import {Image} from "./Image";
import {IoCartOutline, IoClose, IoDisc} from "react-icons/io5";
import {Button} from "./Button";
import {MdCheckBox, MdCheckBoxOutlineBlank} from "react-icons/md";
import {Value} from "./Value";

export function AddRemoveItemButton(props: (ValueOnChangeProperties<number> & { mustOpenDetail?: boolean })) {
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

                <motion.div style={{width: '50%', padding: 5}} whileTap={{scale: 0.9}} onClick={(event) => {
                    if (!mustOpenDetail) {
                        onChange(hasValue ? value - 1 : 1);
                    } else if (mustOpenDetail && hasValue) {
                        event.preventDefault();
                        event.stopPropagation();
                        onChange(-1);
                    }

                }} animate={{opacity: hasValue ? 1 : 0}}>
                    <IoMdRemove fontSize={20}/>
                </motion.div>

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

                <motion.div style={{width: '50%', textAlign: 'right', padding: 5}} whileTap={{scale: 0.9}}
                            onClick={() => {
                                if (!mustOpenDetail) {
                                    onChange(hasValue ? value + 1 : 1);
                                }

                            }} animate={{opacity: hasValue ? 1 : 0}}>
                    <IoMdAdd fontSize={20}/>
                </motion.div>

            </div>
        </div>
        {mustOpenDetail && <div style={{fontSize: 10, color: 'rgba(0,0,0,0.8)', marginTop: 5}}>{'customizable'}</div>}
    </div>;
}

export function AddToCartButton(props: { shoppingCart: Store<CartItem[]>, product: Product }) {
    const {shoppingCart, product} = props;
    const isCustomizable = product.config.length > 0
    const {showSlidePanel} = useAppContext();

    return <div onClick={async () => {
        const result = await showSlidePanel(closePanel => {
            return <ProductDetail product={product} closePanel={closePanel} total={1}/>
        });
        if (result === false) {
            return;
        }
        const cartItem = (result as { product: Product, total: number, totalPrice: number, options: ProductConfigOption[] });
        shoppingCart.setState(items => [...items, cartItem]);
    }}><StoreValue store={shoppingCart}
                   selector={s => (s.filter(t => t.product.id === product.id)?.reduce((total, item) => total + item.total, 0) ?? 0)}
                   property={'value'}>

        <AddRemoveItemButton onChange={(value) => {
            if (isCustomizable) {
                if (value === -1) {
                    shoppingCart.setState(produce(s => {
                        const currentIndex = s.findIndex(s => s.product.id === product.id);
                        if (currentIndex >= 0) {
                            s.splice(currentIndex, 1)
                        }
                    }));
                }
                return;
            }
            shoppingCart.setState(produce(s => {
                const currentIndex = s.findIndex(s => s.product.id === product.id);
                if (currentIndex >= 0) {
                    s[currentIndex].total = value;
                    s[currentIndex].totalPrice = value * product.price
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
}

export function ProductDetail(props: { product: Product, closePanel: (result: any) => void, total: number }) {
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
        <div style={{display: 'flex', padding: 10, background: white, boxShadow: '0 -7px 8px -5px rgba(0,0,0,0.2)'}}>
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
                <div style={{fontSize: 18, paddingBottom: 3, width: 30, textAlign: 'center', fontWeight: 'bold'}}>
                    <StoreValue store={store} selector={s => s.total} property={'value'}>
                        <Value/>
                    </StoreValue>
                </div>
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

