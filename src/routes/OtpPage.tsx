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
import {GuestProfile, Profile} from "../model/Profile";
import {useProfileSetter} from "../model/useProfile";
import produce from "immer";
import {fetchService} from "../components/fetchService";
import {pocketBase} from "../components/pocketBase";

const APP_NAME = process.env.REACT_APP_APPLICATION_NAME;

export function OtpPage(route: RouteProps) {
    const phoneNo = route.params.get('phoneNo');
    const store = useStore({otp: '', countdown: 20, errorMessage: '', token: ''});
    const navigate = useNavigate();
    const [isBusy, setIsBusy] = useState(false);
    const setUserProfile = useProfileSetter();

    useFocusListener(route.path, () => {
        (async () => {
            const token = Math.random().toString().substr(2, 6);
            await fetchService('otp',{phone:phoneNo,otp:token,app:APP_NAME});
            store.setState(old => ({
                otp: '', countdown: 20, errorMessage: '', token
            }));
        })();
        return () => setIsBusy(false);
    });

    useStoreListener(store, s => s.otp, async (next, prev) => {
        if (next.length === 6) {
            setIsBusy(true);
            store.setState(produce(s => {
                s.otp = '';
            }));

            const {valid, profile} = await validateToken(next, phoneNo ?? '', store.stateRef.current.token);
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
                navigate(`profile`);
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
                        (async () => {
                            const token = Math.random().toString().substr(2, 6);
                            const result = await fetchService('otp',{phone:phoneNo,otp:token,app:APP_NAME});
                            console.log('WE HAVE RESULT ',result);
                            store.setState(old => ({
                                otp: '', countdown: 20, errorMessage: '', token
                            }));
                        })();
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
async function validateToken(token: string, phoneNo: string, otp: string): Promise<{ valid: boolean, profile: Profile }> {
    const userName = phoneNo.replace('+','');
    if (token === otp) {
        try{
            const {record} = await pocketBase.collection('users').authWithPassword(userName,'12345678');
            return {
                valid: true,
                profile: {
                    username: record.username,
                    email: record.email,
                    name: record.name,
                    id: record.id,
                    created: new Date(record.created),
                    updated: new Date(record.updated),
                    emailVisibility: record.emailVisibility,
                    verified: record.verified
                }
            }
        }catch(err){
            const result = await pocketBase.collection('users').create({
                "username": userName,
                "password": "12345678",
                "passwordConfirm": "12345678",
                "name": ""
            });
            return {
                valid: true, profile: {
                    username: result.username,
                    email: result.email,
                    name: '',
                    id: result.id,
                    created: new Date(result.created),
                    updated: new Date(result.updated),
                    emailVisibility: result.emailVisibility,
                    verified: result.verified
                }
            }
        }
    } else {
        return {valid: false, profile: GuestProfile};
    }

    // for time being we alwasy say true
    // return new Promise(resolve => {
    //
    //
    //     setTimeout(() => {
    //         if (phoneNo === '+971509018075') {
    //             if (token === '123456') {
    //                 resolve({valid: true, profile: DemoProfile});
    //             } else {
    //                 resolve({valid: false, profile: GuestProfile});
    //             }
    //         } else {
    //             resolve({valid: true, profile: {...GuestProfile, id: nanoid(), phoneNo: phoneNo, name: ''}});
    //         }
    //     }, 3000);
    // });
}

function Error(props: { error: string, style?: CSSProperties }) {
    return <div style={{color: red, ...props.style}}>{props.error}</div>
}