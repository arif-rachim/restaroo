import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoAdd, IoDisc,  IoHeartOutline} from "react-icons/io5";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";

export function DeliveryPage(props: RouteProps) {

    useFocusListener(props.path, (isFocus) => {
        if (isFocus) {
            adjustThemeColor('#F2F2F2');
        }
    });
    return <Page style={{backgroundColor: '#F2F2F2', paddingBottom: 55,paddingTop:65}}>
        <div style={{display:'flex',marginBottom:10}}>
            <div style={{ marginBottom: 5,color:'green',display:'flex',alignItems:'center',padding:10,boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',backgroundColor:'white',borderRadius:10,marginRight:10}}><IoDisc style={{fontSize:20,marginRight:5}}/><div style={{fontWeight:'bold',fontSize:16}}>Veg</div></div>
            <div style={{ marginBottom: 5,color:'red',display:'flex',alignItems:'center',padding:10,boxShadow: '0 3px 10px -3px rgba(0,0,0,0.06)',backgroundColor:'white',borderRadius:10}}><IoDisc style={{fontSize:20,marginRight:5}}/><div style={{fontWeight:'bold',fontSize:16}}>Non-Veg</div></div>
        </div>

        {menus.map((menu) => {
            return <Card key={menu.id} style={{marginBottom: 20}}>
                <CardTitle title={`${menu.name} (${menu.productId.length})`}/>
                {menu.productId.map((productId) => {
                    const product = products.find(p => p.id === productId);
                    invariant(product);
                    const description = product.description.substring(0, 75);
                    return <div key={productId} style={{display: 'flex', padding: 10, marginBottom: 20,borderBottom:'1px dashed rgba(0,0,0,0.1)'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{fontSize: 20, marginBottom: 5}}><IoDisc/></div>
                            <div style={{fontSize: 16, fontWeight: 'bold', marginBottom: 15}}>{product.name}</div>
                            <div style={{fontWeight: 'bold', marginBottom: 10}}>{product.currency} {product.price}</div>
                            <div style={{marginBottom:10}}>
                                {description}
                                <span style={{fontWeight: 'bold'}}>{'...Read More'}</span>
                            </div>
                            <div style={{fontSize:25}}><IoHeartOutline/></div>
                        </div>
                        <div style={{position: 'relative',marginLeft: 20}}>
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
                            <div style={{width: '100%', display:'flex',justifyContent:'center',marginTop:-20,zIndex:0,boxSizing:'border-box'}}>
                                <Button title={'Add'} style={{backgroundColor: '#FAD0CC'}} onTap={() => {
                                }} icon={IoAdd} theme={ButtonTheme.danger}/>
                            </div>
                        </div>

                    </div>
                })}
            </Card>
        })}

    </Page>
}