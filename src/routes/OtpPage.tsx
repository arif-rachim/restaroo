import {RouteProps} from "../components/useRoute";
import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {OtpInput} from "../components/page-components/OtpInput";
import {Button} from "../components/page-components/Button";
import {ButtonTheme, red} from "./Theme";
import {MdOutlineSms} from "react-icons/md";
import {IoCallOutline} from "react-icons/io5";
import {CSSProperties, useEffect, useState} from "react";
import {StoreValue, useStore, useStoreListener} from "../components/store/useStore";
import {useFocusListener} from "../components/RouterPageContainer";
import {useNavigate} from "../components/useNavigate";
import {DemoProfile, GuestProfile, Profile} from "../model/Profile";
import {useUserProfileSetter} from "../model/useUserProfile";
import produce from "immer";
import {nanoid} from "nanoid";


export function OtpPage(route: RouteProps) {
    const phoneNo = route.params.get('phoneNo');
    const store = useStore({otp: '', countdown: 20, errorMessage: ''});
    const navigate = useNavigate();
    const [isBusy, setIsBusy] = useState(false);
    const setUserProfile = useUserProfileSetter();
    useFocusListener(route.path, (isFocus) => {
        if (isFocus) {
            store.setState(old => ({
                otp: '', countdown: 20, errorMessage: ''
            }));
            setIsBusy(false);
        }
    });

    useStoreListener(store, s => s.otp, async (next, prev) => {

        if (next.length === 6) {
            // @TODO FETCH THE USER INFO FROM SERVER OR PERFORM REGISTRATION
            // IF user is not registered then we can ask their information
            // continue to profile to complete the action !!!
            setIsBusy(true);
            const {valid, profile} = await validateToken(next, phoneNo ?? '');
            if (!valid) {
                setIsBusy(false);
                store.setState(produce(s => {
                    s.otp = '';
                    s.countdown = 0;
                    s.errorMessage = 'Token is not valid';
                }))
                return;
            }

            if (profile.name === '') {
                navigate(`profile/${profile.id}/${phoneNo}`);
            } else {
                setUserProfile(profile);
                navigate('delivery');
            }
        }
    })
    useEffect(() => {
        const intervalId = setInterval(() => {
            store.setState(s => {
                if (s.countdown > 0) {
                    return {...s, countdown: s.countdown - 1};
                }
                return s;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [store])

    return <Page>
        <Header title={'OTP Verification'}/>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
            <div style={{marginBottom: 10, fontSize: 14}}>
                We have sent a verification code to
            </div>
            <div style={{fontSize: 15, fontWeight: 'bold', marginBottom: 20}}>{phoneNo}</div>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 30, color: 'black'}}>
                <StoreValue store={store} selector={[s => s.otp, s => {
                    const hasError = s.errorMessage !== '';
                    return hasError || isBusy
                }]} property={['value', 'disabled']}>
                    <OtpInput value={''} valueLength={6} onChange={(newVal) => {
                        store.setState(old => ({...old, otp: newVal, errorMessage: ''}));
                    }}/>
                </StoreValue>
                <StoreValue store={store} selector={s => s.errorMessage} property={'error'}>
                    <Error error={''}/>
                </StoreValue>
            </div>
            <div style={{display: 'flex', marginBottom: 30}}>
                <StoreValue store={store} selector={[s => s.countdown !== 0,
                    s => s.countdown === 0 ? 'Resend SMS' : `Resend SMS in ${s.countdown}`
                ]} property={['disabled', 'title']}>
                    <Button title={''} icon={MdOutlineSms} theme={ButtonTheme.danger} onTap={() => {
                        store.setState({
                            otp: '',
                            countdown: 20,
                            errorMessage: ''
                        });
                    }} style={{fontSize: 13, marginRight: 10}} iconStyle={{fontSize: 15, width: 15, height: 15}}
                            isBusy={isBusy}/>
                </StoreValue>
                <StoreValue store={store} selector={[s => s.countdown !== 0,
                    s => s.countdown === 0 ? 'Call me' : `Call me in ${s.countdown}`
                ]} property={['disabled', 'title']}>
                    <Button title={''} icon={IoCallOutline} theme={ButtonTheme.danger} onTap={() => {

                    }} style={{fontSize: 13}} iconStyle={{fontSize: 15, width: 15, height: 15}} isBusy={isBusy}/>
                </StoreValue>
            </div>
            <div style={{color: red}}> Try other login methods</div>
        </div>
    </Page>
}

/**
 * THIS IS THE FUNCTION TO VALIDATE TOKEN AGAINST THE SERVER, THIS IS DUMMY FOR TEMPORARY
 * @param token
 * @param phoneNo
 */
async function validateToken(token: string, phoneNo: string): Promise<{ valid: boolean, profile: Profile }> {
    // for time being we alwasy say true
    return new Promise(resolve => {
        setTimeout(() => {
            if (phoneNo === '+971509018075') {
                if (token === '123456') {
                    resolve({valid: true, profile: DemoProfile});
                } else {
                    resolve({valid: false, profile: GuestProfile});
                }
            } else {
                resolve({valid: true, profile: {...GuestProfile, id: nanoid(), phoneNo: phoneNo, name: ''}});
            }
        }, 3000);
    });
}

function Error(props: { error: string, style?: CSSProperties }) {
    return <div style={{color: red, ...props.style}}>{props.error}</div>
}