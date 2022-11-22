import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoAdd, IoChevronDown, IoDisc, IoHeartOutline} from "react-icons/io5";
import {Button} from "../components/page-components/Button";
import {ButtonTheme, veryLightRed} from "./Theme";
import {MdPlace} from "react-icons/md";
import {motion} from "framer-motion";
import {CgProfile} from "react-icons/cg";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useId, useRef} from "react";
import {StoreValue, useStore} from "../components/store/useStore";

export function DeliveryPage(props: RouteProps) {
    useFocusListener(props.path, () => {
        adjustThemeColor('#F2F2F2');
    });
    const {appDimension} = useAppContext();
    const navigate = useNavigate();
    const componentId = useId();
    const titleRef = useRef<{ title: string, offsetY: number }[]>([]);
    const selectedTitle = useStore('');
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
                                <img src={product.imageAddress} width={130} height={130} style={{
                                    width: 130,
                                    height: 130,
                                    marginBottom: -5,
                                    flexShrink: 0,
                                    flexGrow: 0,
                                    backgroundColor: 'rgba(0,0,0,0.1)'
                                }} alt={'product'}/>

                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: -20,
                                zIndex: 0,
                                boxSizing: 'border-box'
                            }}>
                                <Button title={'Add'} style={{backgroundColor: veryLightRed}} onTap={() => {
                                }} icon={IoAdd} theme={ButtonTheme.danger}/>
                            </div>
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
                <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%'}}>
                    <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 3}}>Home</div>
                        <div style={{marginLeft: 3, marginBottom: 2}}>
                            <IoChevronDown/>
                        </div>
                    </div>
                    <div style={{
                        textOverflow: 'ellipsis',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>Marina Diamond 5, Flat 806, Dubai Marina, Dubai Marina
                    </div>
                </div>
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