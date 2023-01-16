import {Page} from "./Page";
import {
    Button,
    ButtonTheme,
    Card,
    Header,
    Input,
    isEmptyObject,
    isEmptyText,
    pageBackgroundColor,
    Profile,
    RouteProps,
    StoreValue,
    theme,
    useAppContext,
    useFocusListener,
    useNavigate,
    useStore
} from "@restaroo/lib";
import {CgProfile} from "react-icons/cg";
import {IoSaveOutline} from "react-icons/io5";
import produce from "immer";
import {useCallback, useState} from "react";
import {pocketBase} from "../service";

export function ProfilePage(props: RouteProps) {
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const {store: appStore} = useAppContext();
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
            avatar: model?.avatar,
            errors: {
                name: '',
                username: ''
            }
        });
    useFocusListener(props.path, () => {
        const model = pocketBase.authStore.model;
        store.set(produce(s => {
            s.verified = model?.verified;
            s.updated = new Date(model?.updated ?? '');
            s.created = new Date(model?.created ?? '');
            s.emailVisibility = model?.emailVisibility;
            s.username = model?.username;
            s.id = model?.id ?? '';
            s.email = model?.email;
            s.name = model?.name;
            s.errors.name = '';
            s.errors.phoneNo = '';

        }))
    })
    const validate = useCallback(() => {
        store.set(produce(s => {
            s.errors.name = isEmptyText(s.name) ? 'Name is required' : '';
            s.errors.phoneNo = isEmptyText(s.username) ? 'Phone number is required' : '';
        }));
        return isEmptyObject(store.get().errors);
    }, [store]);

    return <Page style={{backgroundColor: pageBackgroundColor}}>
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
                    <StoreValue store={store} selector={s => [s.name, s.errors.name]}
                                property={['value', 'error']}>
                        <Input title={'Name :'} titlePosition={'left'} titleWidth={90}
                               placeholder={'Enter your name here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.set(produce(s => {
                                s.name = element.target.value;
                                s.errors.name = '';
                            }))
                        }}/>
                    </StoreValue>
                    {/* We ignore this because we believe in our app we are not using email to communicate*/}
                    {/*<StoreValue store={store} selector={[s => s.email, s => s.errors.email]}*/}
                    {/*            property={['value', 'error']}>*/}
                    {/*    <Input title={'Email :'} titlePosition={'left'} titleWidth={90} placeholder={'Enter your email address here'}*/}
                    {/*           style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {*/}
                    {/*        store.set(produce(s => {*/}
                    {/*            s.email = element.target.value;*/}
                    {/*            s.errors.email = '';*/}
                    {/*        }))*/}
                    {/*    }}/>*/}
                    {/*</StoreValue>*/}
                    <StoreValue store={store} selector={s => [s.username, s.errors.username]}
                                property={['value', 'error']}>
                        <Input title={'Phone :'} titlePosition={'left'} titleWidth={90}
                               placeholder={'Enter your phone number here'}
                               style={{containerStyle: {marginBottom: 10}}} onChange={(element) => {
                            store.set(produce(s => {
                                s.username = element.target.value;
                                s.errors.phoneNo = '';
                            }))
                        }} readOnly={true}/>
                    </StoreValue>
                </Card>
            </div>
        </div>
        <div style={{padding: '10px 10px', display: 'flex', flexDirection: 'column'}}>
            <Button title={'Update Profile'} theme={ButtonTheme.promoted} icon={IoSaveOutline}
                    onTap={async () => {
                        if (validate()) {
                            setBusy(true);
                            const state = store.get();
                            const profile: Profile = {
                                name: state.name,
                                username: state.username,
                                email: state.email,
                                id: state.id,
                                updated: new Date(),
                                verified: state.verified,
                                emailVisibility: state.emailVisibility,
                                created: state.created,
                                avatar: state.avatar
                            }
                            const {result, error} = await updateUserProfile(profile);
                            setBusy(false);
                            if (error) {
                                // do something
                                return;
                            }
                            appStore.set(produce(s => {
                                s.user = result
                            }));
                            navigate('delivery');
                        }
                    }}
                    style={{backgroundColor: theme[ButtonTheme.promoted]}}
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
    } = await pocketBase.collection('users').update(profile.id, {name: profile.name});
    // await pocketBase.collection('users').requestEmailChange(profile.email);
    return {
        result: {
            name: record.name,
            username: record.username,
            email: record.email,
            emailVisibility: record.emailVisibility,
            created: new Date(record.created),
            updated: new Date(record.updated),
            verified: record.verified,
            id: record.id,
            avatar: record.avatar
        },
        error: ''
    }
}