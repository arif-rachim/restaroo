import {
    Button,
    ButtonTheme,
    GuestProfile,
    Header,
    OtpInput,
    Profile,
    red,
    RouteProps,
    StoreValue,
    useAppContext,
    useFocusListener,
    useNavigate,
    useStore,
    useStoreListener
} from "@restaroo/lib";
import {Page} from "./Page";
import {MdOutlineSms} from "react-icons/md";
import {IoCallOutline} from "react-icons/io5";
import {CSSProperties, useEffect, useState} from "react";
import produce from "immer";
import {fetchService, pocketBase} from "../service";

const APP_NAME = process.env.REACT_APP_APPLICATION_NAME;

export function OtpPage(route: RouteProps) {
    const phoneNo = route.params.get('phoneNo');
    const store = useStore({otp: '', countdown: 20, errorMessage: '', token: ''});
    const {store: appStore} = useAppContext();
    const navigate = useNavigate();
    const [isBusy, setIsBusy] = useState(false);

    useFocusListener(route.path, () => {
        (async () => {
            const token = Math.random().toString().substr(2, 6);
            await fetchService('otp', {phone: phoneNo, otp: token, app: APP_NAME});
            store.set(old => ({
                otp: '', countdown: 20, errorMessage: '', token
            }));
        })();
        return () => setIsBusy(false);
    });

    useStoreListener(store, s => s.otp, async (next, prev) => {
        if (next.length === 6) {
            setIsBusy(true);
            store.set(produce(s => {
                s.otp = '';
            }));

            const {valid, profile} = await validateToken(next, phoneNo ?? '', store.get().token);
            if (!valid) {
                setIsBusy(false);
                store.set(produce(s => {
                    s.otp = '';
                    s.countdown = 0;
                    s.errorMessage = 'Token is not valid';
                }))
                return;
            }

            if (profile.name === '') {
                navigate(`profile`);
            } else {
                appStore.set(produce(s => {
                    s.user = profile;
                }))
                navigate('delivery');
            }
        }
    })
    useEffect(() => {
        const intervalId = setInterval(() => {
            store.set(s => {
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
                <StoreValue store={store} selector={s => {
                    const hasError = s.errorMessage !== '';
                    return [s.otp, hasError || isBusy];
                }} property={['value', 'disabled']}>
                    <OtpInput value={''} valueLength={6} onChange={(newVal) => {
                        store.set(old => ({...old, otp: newVal, errorMessage: ''}));
                    }}/>
                </StoreValue>
                <StoreValue store={store} selector={s => s.errorMessage} property={'error'}>
                    <Error error={''}/>
                </StoreValue>
            </div>
            <div style={{display: 'flex', marginBottom: 30}}>
                <StoreValue store={store}
                            selector={s => [s.countdown !== 0, s.countdown === 0 ? 'Resend SMS' : `Resend SMS in ${s.countdown}`]}
                            property={['disabled', 'title']}>
                    <Button title={''} icon={MdOutlineSms} theme={ButtonTheme.danger} onTap={() => {
                        (async () => {
                            const token = Math.random().toString().substr(2, 6);
                            await fetchService('otp', {phone: phoneNo, otp: token, app: APP_NAME});
                            store.set(old => ({
                                otp: '', countdown: 20, errorMessage: '', token
                            }));
                        })();
                    }} style={{fontSize: 13, marginRight: 10}} iconStyle={{fontSize: 15, width: 15, height: 15}}
                            isBusy={isBusy}/>
                </StoreValue>
                <StoreValue store={store} selector={s => [s.countdown !== 0,
                    s.countdown === 0 ? 'Call me' : `Call me in ${s.countdown}`
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
    const userName = phoneNo.replace('+', '');
    if (token === otp) {
        try {
            const {record} = await pocketBase.collection('users').authWithPassword(userName, '12345678');
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
                    verified: record.verified,
                    avatar: record.avatar
                }
            }
        } catch (err) {
            await pocketBase.collection('users').create({
                "username": userName,
                "password": "12345678",
                "passwordConfirm": "12345678",
                "name": ""
            });
            const {record} = await pocketBase.collection('users').authWithPassword(userName, '12345678');
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
                    verified: record.verified,
                    avatar: record.avatar
                }
            }
        }
    } else {
        return {valid: false, profile: GuestProfile};
    }
}

function Error(props: { error: string, style?: CSSProperties }) {
    return <div style={{color: red, ...props.style}}>{props.error}</div>
}