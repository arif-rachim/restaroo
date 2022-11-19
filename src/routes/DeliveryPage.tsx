import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";
import {Card, CardTitle} from "../components/page-components/Card";
import {menus, products} from "../model/data";
import invariant from "tiny-invariant";
import {IoAdd, IoDisc} from "react-icons/io5";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";

export function DeliveryPage(props:RouteProps) {

    useFocusListener(props.path,(isFocus) => {
        if(isFocus){
            adjustThemeColor('#F2F2F2');
        }
    });
    return <Page style={{backgroundColor:'#F2F2F2'}}>
        {menus.map((menu) => {
            return<Card key={menu.id} style={{marginBottom:20}}>
                <CardTitle title={'Recomended (3)'}/>
                {menu.productId.map((productId) => {
                    const product = products.find(p => p.id === productId);
                    invariant(product);
                    const description = product.description.substring(0,75);
                    return <div key={productId} style={{display:'flex',padding:10,marginBottom:20}}>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <div style={{fontSize:20,marginBottom:5}}><IoDisc/></div>
                            <div style={{fontSize:16,fontWeight:'bold',marginBottom:15}}>{product.name}</div>
                            <div style={{fontWeight:'bold',marginBottom:10}}>{product.currency} {product.price}</div>
                            <div>
                                {description}
                                <span style={{fontWeight:'bold'}}>{'...Read More'}</span>
                            </div>
                        </div>
                        <div style={{width:130,height:150,marginLeft:20,
                            borderRadius:20,border:'1px solid rgba(0,0,0,0.1)',
                            flexShrink:0,flexGrow:0,
                            alignItems:'center',
                            display:'flex',
                            flexDirection:'column'
                        }}>
                            <div style={{width:130,height:130,marginBottom:-5,flexShrink:0,flexGrow:0,backgroundColor:'rgba(0,0,0,0.1)'}}>

                            </div>
                            <Button title={'Add'} style={{backgroundColor:'#FAD0CC'}} onTap={() =>{}} icon={IoAdd} theme={ButtonTheme.danger}/>
                        </div>

                    </div>
                })}
            </Card>
        })}

    </Page>
}