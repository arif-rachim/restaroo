import {RouteProps} from "../components/useRoute";
import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {OtpInput} from "../components/page-components/OtpInput";
import {Button} from "../components/page-components/Button";
import {ButtonTheme, red} from "./Theme";
import {MdOutlineSms} from "react-icons/md";
import {IoCallOutline} from "react-icons/io5";
import {useEffect} from "react";
import {StoreValue, useStore, useStoreListener} from "../components/store/useStore";
import { useFocusListener} from "../components/RouterPageContainer";

export function OtpPage(route: RouteProps) {
    const phoneNo = route.params.get('phoneNo');
    const store = useStore({otp: '', countdown: 20});

    useFocusListener(route.path,(isFocus) => {
        if(isFocus){
            store.setState(old => ({
                otp:'',countdown: 20
            }))
        }
    })
    useStoreListener(store,s => s.otp,(next,prev) => {

        if(next.length === 6){
            // @TODO FETCH THE USER INFO FROM SERVER OR PERFORM REGISTRATION
            window.history.back();
        }
    })
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         store.setState(s => {
    //             if (s.countdown > 0) {
    //                 return {...s, countdown: s.countdown - 1};
    //             }
    //             return s;
    //         });
    //     }, 1000);
    //     return () => clearInterval(intervalId);
    // }, [store])

    return <Page>
        <Header title={'OTP Verification'}/>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
            <div style={{marginBottom: 10, fontSize: 14}}>
                We have sent a verification code to
            </div>
            <div style={{fontSize: 15, fontWeight: 'bold', marginBottom: 20}}>{phoneNo}</div>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 30, color: 'black'}}>
                <StoreValue store={store} selector={s => s.otp} property={'value'}>
                <OtpInput disabled={false} value={''} valueLength={6} onChange={(newVal) => {
                    store.setState(old => ({...old,otp: newVal}));
                }}/>
                </StoreValue>
            </div>
            <div style={{display: 'flex', marginBottom: 30}}>
                <StoreValue store={store} selector={[s => s.countdown !== 0,
                    s => s.countdown === 0 ? 'Resend SMS' : `Resend SMS in ${s.countdown}`
                ]} property={['disabled','title']}>
                    <Button title={''} icon={MdOutlineSms} theme={ButtonTheme.danger} onTap={() => {

                    }} style={{fontSize: 13, marginRight: 10}} iconStyle={{fontSize: 15, width: 15, height: 15}}/>
                </StoreValue>
                <StoreValue store={store} selector={[s => s.countdown !== 0,
                    s => s.countdown === 0 ? 'Call me' : `Call me in ${s.countdown}`
                ]} property={['disabled', 'title']}>
                    <Button title={''} icon={IoCallOutline} theme={ButtonTheme.danger} onTap={() => {

                    }} style={{fontSize: 13}} iconStyle={{fontSize: 15, width: 15, height: 15}}/>
                </StoreValue>
            </div>
            <div style={{color: red}}> Try other login methods</div>
        </div>
    </Page>
}