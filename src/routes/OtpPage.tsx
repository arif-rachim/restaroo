import {RouteProps} from "../components/useRoute";
import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {OtpInput} from "../components/page-components/OtpInput";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";
import {MdOutlineSms} from "react-icons/md";
import {IoCallOutline} from "react-icons/io5";

export function OtpPage(route:RouteProps){
    const phoneNo = route.params.get('phoneNo');
    return <Page>
        <Header title={'OTP Verification'} />
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:30}}>
            <div style={{marginBottom:10,fontSize:14}}>
                We have sent a verification code to
            </div>
            <div style={{fontSize:15,fontWeight:'bold',marginBottom:20}}>{phoneNo}</div>
            <OtpInput disabled={false} valueLength={6} value={''} onChange={() => {

            }}/>
            <div style={{display:'flex'}}>
                <Button title={'Resend SMS in 20'} icon={MdOutlineSms} theme={ButtonTheme.danger} onTap={() =>{

                }} style={{fontSize:13}}/>
                <Button title={'Call me in 20'} icon={IoCallOutline} theme={ButtonTheme.danger} onTap={() => {

                }} style={{fontSize:13}}/>
            </div>
        </div>

        <div></div>
    </Page>
}