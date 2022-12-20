import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {CgProfile} from "react-icons/cg";
import {Card} from "../components/page-components/Card";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {ButtonTheme, veryLightBlue} from "./Theme";
import {IoSaveOutline} from "react-icons/io5";
import {StoreValue, useStore} from "../components/store/useStore";
import produce from "immer";
import {useCallback, useState} from "react";
import {isEmptyText} from "../components/page-components/utils/isEmptyText";
import {isEmptyObject} from "../components/page-components/utils/isEmptyObject";
import {Profile} from "../model/Profile";
import {useProfileSetter} from "../model/useProfile";
import {useNavigate} from "../components/useNavigate";
import {pocketBase} from "../components/pocketBase";

export function ProfilePage() {
    const [busy, setBusy] = useState(false);
    const setUserProfile = useProfileSetter();
    const navigate = useNavigate();
    const model = pocketBase.authStore.model;
    const store = useStore<Profile & { errors: any }>(
        {
            verified: model?.verified,
            updated: new Date(model?.updated ?? ''),
            created: new Date(model?.created ?? ''),
            emailVisibility: model?.emailVisibility,
            username: model?.username,
            id: model?.id ?? '',
            email: model?.email,
            name: model?.name,
            errors: {
                name: '',
                username: '',
                email: '',
            }
        });
    const validate = useCallback(() => {
        store.setState(produce(s => {
            s.errors.name = isEmptyText(s.name) ? 'Name is required' : '';
            s.errors.phoneNo = isEmptyText(s.username) ? 'Phone number is required' : '';
            s.errors.email = isEmptyText(s.email) ? 'Email is required' : '';
        }));
        return isEmptyObject(store.stateRef.current.errors);
    }, [store]);

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
                    <StoreValue store={store} selector={[s => s.username, s => s.errors.username]}
                                property={['value', 'error']}>
                        <Input title={'Phone Number :'} placeholder={'Enter your phone number here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.setState(produce(s => {
                                s.username = element.target.value;
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
                                username: state.username,
                                email: state.email,
                                id: state.id,
                                updated: new Date(),
                                verified: state.verified,
                                emailVisibility: state.emailVisibility,
                                created: state.created
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

async function updateUserProfile(profile: Profile): Promise<{ result: Profile, error: string }> {

    const record: {
        "id": string,
        "created": string,
        "updated": string,
        "username": string,
        "verified": boolean,
        "emailVisibility": boolean,
        "email": string,
        "name": string,
        "avatar": string
    } = await pocketBase.collection('users').update(profile.id, {name : profile.name,emailVisibility:profile.emailVisibility});
    await pocketBase.collection('users').requestEmailChange(profile.email);
    return {
        result: {
            name: record.name,
            username: record.username,
            email: record.email,
            emailVisibility: record.emailVisibility,
            created: new Date(record.created),
            updated: new Date(record.updated),
            verified: record.verified,
            id: record.id
        },
        error: ''
    }
}