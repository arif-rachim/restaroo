import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {useFocusListener} from "../components/RouterPageContainer";
import {RouteProps} from "../components/useRoute";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";

export function AccountPage(props:RouteProps){
    useFocusListener(props.path,(isFocus) => {
        if(isFocus){
            adjustThemeColor('#F2F2F2');
        }
    });
    return <Page style={{padding:0,background:'rgba(0,0,0,0.05)'}}>
        <Header title={''} />
        <div style={{padding:10,display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',backgroundColor:'white',padding:'10px 10px',borderRadius:13,boxShadow:'0 3px 10px -3px rgba(0,0,0,0.06)'}}>
                <div style={{display:'flex',flexDirection:'column',flexGrow:1}}>
                    <div style={{fontSize:23,fontWeight:'bold',marginBottom:10}}>Arif</div>
                    <div style={{marginBottom:5}} >a.arif.r@gmail.com</div>
                    <div >+971509018075</div>
                </div>
                <div style={{width:80,height:80,backgroundColor:'#CCC'}}>

                </div>
            </div>
        </div>
    </Page>
}