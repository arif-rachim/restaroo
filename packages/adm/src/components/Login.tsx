import {
    ButtonTheme,
    Card,
    GuestProfile,
    OnEnter,
    OtpInput,
    Profile,
    StoreValue, useAppContext,
    useLogin,
    useStore,
    useStoreListener,
    useStoreValue,
    Visible
} from "@restaroo/lib";
import produce from "immer";
import {IoLogIn, IoPhonePortrait, IoRefresh, IoSave} from "react-icons/io5";
import {DInput} from "./DInput";
import {DButton} from "./DButton";

export function Login() {
    const store = useStore<{ phoneNumber: string, status: 'START' | 'WAITING-OTP' | 'WAITING-VALIDATION' | 'REGISTER-NEW-USER' | 'COMPLETE' |'OTP-VALIDATION-FAILED', otp: string,countryCode:string }>({
        phoneNumber: '',
        otp: '',
        status: 'START',
        countryCode : '+971'
    });
    const {showPicker} = useAppContext();
    const profileStore = useStore<Profile>(GuestProfile)
    const {login,updateProfile,fetchOtp,validateOtp} = useLogin();

    const status = useStoreValue(store, s => s.status);
    useStoreListener(store, s => s.otp, async (next) => {
        if (next && next.length === 6) {
            store.set(produce(s => {
                s.status = 'WAITING-VALIDATION';
            }));
            const profile = await validateOtp(store.get().otp, fullPhoneNumber());
            if (profile===false) {
                store.set(produce(s => {
                    s.status = 'OTP-VALIDATION-FAILED';
                }));
            } else if(profile.name === '') {
                profileStore.set(profile);
                store.set(produce(s => {
                    s.status = 'REGISTER-NEW-USER';
                }));
            } else {
                await login(profile);
                store.set(produce(s => {
                    s.status = 'COMPLETE';
                }));
            }
        }
    });
    function fullPhoneNumber(){
        return store.get().countryCode+store.get().phoneNumber
    }
    return <div
        style={{padding: 10, backgroundColor: '#F2F2F2', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: "flex", flexDirection: 'column', margin: 'auto',alignItems:'center'}}>
            <Visible if={['START', 'WAITING-OTP','WAITING-VALIDATION','OTP-VALIDATION-FAILED'].includes(status)}>
                <OnEnter onEnter={async (event: KeyboardEvent) => {
                    await fetchOtp(fullPhoneNumber(), 'RESTAROO-ADM');
                    store.set(produce(s => {
                        s.status = 'WAITING-OTP';
                    }));
                }}>
                    <Card style={{padding: 20, marginBottom: 10,maxWidth:400}}>
                        <Visible if={status === 'START'}>
                            <div style={{lineHeight:1.5,marginTop:10,marginBottom:10}}>A one-time password (OTP) will be sent to the mobile phone number you provided. Please double check that the country code that corresponds to your phone number has been entered correctly.</div>

                            <StoreValue store={store} selector={s => s.phoneNumber} property={'value'}>
                                <DInput titlePosition={'left'} style={{titleStyle:{margin:0,padding:0},containerStyle:{alignItems:'flex-start'}}}  title={<StoreValue store={store} selector={s => s.countryCode} property={'value'} >
                                    <DInput titlePosition={'left'}  titleWidth={100} title={'Phone Number'} placeholder={'Select Country Code'} onFocus={async () => {
                                        const country = await showPicker({
                                            value:store.get().countryCode,
                                            picker:'country'
                                        });
                                        store.set(produce(s => {
                                            s.countryCode = country
                                        }))
                                    }} style={{errorStyle:{height:0},containerStyle:{padding:0,margin:0},titleStyle:{margin:0,padding:0,marginRight:5},inputStyle:{width:60,marginRight:5}}} readOnly={true}/>
                                </StoreValue>} placeholder={'50123456'}
                                       onChange={e => store.set(produce(s => {
                                           s.phoneNumber = e.target.value.toUpperCase();
                                       }))}/>
                            </StoreValue>
                            <DButton title={'Generate OTP'} theme={ButtonTheme.danger} onTap={async () => {
                                await fetchOtp(fullPhoneNumber(), 'RESTAROO-ADM');
                                store.set(produce(s => {
                                    s.status = 'WAITING-OTP';
                                }))
                            }} icon={IoLogIn} ></DButton>
                        </Visible>
                        <Visible if={status === 'WAITING-OTP'}>
                            <div style={{lineHeight:1.5,marginTop:10,marginBottom:10}}>{`Please enter the 6-digit OTP to validate your request. An OTP message is being sent to your mobile phone ${fullPhoneNumber()}.`}</div>
                            <div style={{fontSize:12,fontWeight:'bold',marginBottom:10}}>Please enter the otp :</div>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <StoreValue store={store} selector={s => [s.otp]} property={['value']}>
                                <OtpInput  value={''} valueLength={6} onChange={(e) => {
                                    store.set(produce(s => {
                                        s.otp = e
                                    }));
                                }}/>
                            </StoreValue>
                            </div>
                        </Visible>
                        <Visible if={status === 'OTP-VALIDATION-FAILED'}>
                            <div style={{lineHeight:1.5,marginTop:0,marginBottom:20}}>{`OTP validation failed. Would you like to resend the OTP or send it to a different phone number? The previous OTP was sent to ${fullPhoneNumber()}.`}</div>
                            <div style={{display:'flex'}}>
                                <DButton onTap={async () => {
                                    await fetchOtp(fullPhoneNumber(), 'RESTAROO-ADM');
                                    store.set(produce(s => {
                                        s.status = 'WAITING-OTP';
                                        s.otp = '';
                                    }));
                                }} title={'Resend OTP'} style={{width:'50%',fontSize:12,marginRight:10}} iconStyle={{fontSize:16}} icon={IoRefresh} theme={ButtonTheme.danger}  />
                                <DButton onTap={() => {
                                    store.set(produce(s => {
                                        s.status = 'START';
                                        s.otp = '';
                                        s.phoneNumber = '';
                                    }));

                                }} title={'Resend to different Number'} style={{width:'50%',fontSize:12,padding:0}} iconStyle={{fontSize:16}} icon={IoPhonePortrait} theme={ButtonTheme.danger} />
                            </div>
                        </Visible>
                    </Card>
                </OnEnter>
            </Visible>
            <Visible if={status === 'REGISTER-NEW-USER'}>
                <OnEnter onEnter={() => {

                }}>
                    <Card style={{padding: 20, marginBottom: 10,width:400}}>
                        <div style={{lineHeight:1.5,marginTop:0,marginBottom:20}}>{`You appear to be visiting this application for the first time; please provide your name to complete registration.`}</div>
                        <DInput title={'Name'} titlePosition={'left'} placeholder={'Enter your name'} onChange={event => {
                            profileStore.set(produce(s => {
                                s.name = event.target.value.toUpperCase();
                            }))
                        }}/>
                        <DButton onTap={async () => {
                            const updatedProfile:Profile = await updateProfile(profileStore.get());
                            profileStore.set(updatedProfile);
                            await login(updatedProfile);
                            store.set(produce(s => {
                                s.status = 'COMPLETE';
                            }))
                        }} title={'Update Name'} icon={IoSave} theme={ButtonTheme.danger} />
                    </Card>
                </OnEnter>
            </Visible>
        </div>
    </div>
}