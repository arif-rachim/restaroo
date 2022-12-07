import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";
import {CgProfile} from "react-icons/cg";
import {Card} from "../components/page-components/Card";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {ButtonTheme, veryLightBlue} from "./Theme";
import {IoSaveOutline} from "react-icons/io5";
import {StoreValue, useStore} from "../components/store/useStore";
import produce from "immer";
import {dateToDdMmmYyyy} from "../components/page-components/utils/dateToDdMmmYyyy";
import {useCallback, useState} from "react";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import {isNullOrUndefined} from "../components/page-components/utils/isNullOrUndefined";
import {isEmptyObject} from "../components/page-components/utils/isEmptyObject";
import {useAppContext} from "../components/useAppContext";
import {GuestProfile, Profile} from "../model/Profile";
import {useProfileSetter} from "../model/useProfile";
import {useNavigate} from "../components/useNavigate";

export function ProfilePage(props: RouteProps) {
    const phoneNo = props.params.get('phoneNo');
    const profileId = props.params.get('profileId');
    const [busy, setBusy] = useState(false);
    const setUserProfile = useProfileSetter();
    const navigate = useNavigate();
    const store = useStore<Profile & { errors: any }>({
        ...GuestProfile,
        birthday: undefined,
        phoneNo: phoneNo ?? '',
        id: profileId ?? '',
        email: '',
        name: '',
        errors: {
            name: '',
            phoneNo: '',
            email: '',
            birthday: '',
            gender: '',
        }
    });
    const validate = useCallback(() => {
        store.setState(produce(s => {
            s.errors.name = isEmptyText(s.name) ? 'Name is required' : '';
            s.errors.phoneNo = isEmptyText(s.phoneNo) ? 'Phone number is required' : '';
            s.errors.email = isEmptyText(s.email) ? 'Email is required' : '';
            s.errors.birthday = isNullOrUndefined(s.birthday) ? 'Birthday is required' : '';
            s.errors.gender = isNullOrUndefined(s.gender) ? 'Gender is required' : '';
        }));
        return isEmptyObject(store.stateRef.current.errors);
    }, [store]);
    const context = useAppContext();
    return <Page style={{backgroundColor: '#F2F2F2'}}>
        <Header title={'Complete your Profile'}/>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20
        }}>
            <CgProfile fontSize={90}/>
            <div style={{fontSize: 16}}>Change Photo</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto', flexGrow: 1}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
                <Card>
                    <StoreValue store={store} selector={[s => s.name, s => s.errors.name]}
                                property={['value', 'error']}>
                        <Input title={'Name :'} placeholder={'Enter your name here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.setState(produce(s => {
                                s.name = element.target.value;
                                s.errors.name = '';
                            }))
                        }}/>
                    </StoreValue>
                    <StoreValue store={store} selector={[s => s.phoneNo, s => s.errors.phoneNo]}
                                property={['value', 'error']}>
                        <Input title={'Phone Number :'} placeholder={'Enter your phone number here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.setState(produce(s => {
                                s.phoneNo = element.target.value;
                                s.errors.phoneNo = '';
                            }))
                        }}/>
                    </StoreValue>
                    <StoreValue store={store} selector={[s => s.email, s => s.errors.email]}
                                property={['value', 'error']}>
                        <Input title={'Email :'} placeholder={'Enter your email address here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.setState(produce(s => {
                                s.email = element.target.value;
                                s.errors.email = '';
                            }))
                        }}/>
                    </StoreValue>
                    <StoreValue store={store} selector={[s => dateToDdMmmYyyy(s.birthday), s => s.errors.birthday]}
                                property={['value', 'error']}>
                        <Input title={'Birthday :'} placeholder={'DD-MMM-YYYY'}
                               style={{containerStyle: {marginBottom: 10}}} readOnly={true} onFocus={async () => {
                            const value = await context.showPicker({
                                picker: 'date',
                                value: store.stateRef.current.birthday
                            });
                            store.setState(produce(s => {
                                s.birthday = (value as any);
                                s.errors.birthday = '';
                            }))
                        }}/>
                    </StoreValue>
                    <StoreValue store={store} selector={[s => s.gender, s => s.errors.gender]}
                                property={['value', 'error']}>
                        <Input title={'Gender :'} placeholder={'Enter your gender here'}
                               style={{containerStyle: {marginBottom: 10}}} readOnly={true} onFocus={async () => {
                            const value = await context.showPicker({
                                picker: 'gender',
                                value: store.stateRef.current.gender
                            });
                            store.setState(produce(s => {
                                s.gender = value;
                                s.errors.gender = '';
                            }))
                        }}/>
                    </StoreValue>
                </Card>
            </div>
        </div>
        <div style={{padding: '10px 10px', display: 'flex', flexDirection: 'column'}}>
            <Button title={'Update Profile'} theme={ButtonTheme.promoted} icon={IoSaveOutline}
                    onTap={async () => {
                        if (validate()) {
                            setBusy(true);
                            const state = store.stateRef.current;
                            const profile: Profile = {
                                name: state.name,
                                phoneNo: state.phoneNo ?? '',
                                email: state.email,
                                birthday: state.birthday,
                                gender: state.gender,
                                id: state.id,
                                lastUpdatedAt: new Date(),
                                lastUpdatedBy: state.name,
                                createdBy: state.name,
                                createdAt: new Date()
                            }
                            const {result, error} = await updateUserProfile(profile);
                            setBusy(false);
                            if (error) {
                                // do something
                                return;
                            }
                            setUserProfile(result);
                            navigate('delivery');
                        }
                    }}
                    style={{backgroundColor: veryLightBlue}}
                    isBusy={busy}
            />
        </div>

    </Page>
}

function updateUserProfile(profile: Profile): Promise<{ result: Profile, error: string }> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({error: '', result: profile})
        }, 3000);
    })
}