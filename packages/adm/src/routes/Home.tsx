import {Button, ButtonTheme, Card, GuestProfile, Input, RouteProps, useProfile, OnEnter, useStore} from "@restaroo/lib";
import {IoLogIn, IoSave} from "react-icons/io5";
import {fetchService} from "../service";

export default function Home(props: RouteProps) {
    const profile = useProfile();
    if (profile.id === GuestProfile.id) {
        return <LoginOrRegister></LoginOrRegister>
    }
    return <div style={{width: '100%', height: '100%'}}>
        <Button title={'Hello World'} onTap={() => {
        }} icon={IoSave} theme={ButtonTheme.danger}></Button>
    </div>
}

function LoginOrRegister() {
    const store = useStore<{phoneNumber:string}>({phoneNumber:''});
    return <div
        style={{padding: 10, backgroundColor: '#F2F2F2', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: "flex", flexDirection: 'column', maxWidth: 400,width:'100%',margin:'auto'}}>
            <OnEnter onEnter={(event:KeyboardEvent) => {
                const shit = store.get();

            }}>
            <Card style={{padding: 10, marginBottom:10}}>
                <Input title={'Phone No'} placeholder={'Please enter your Phone Number'}/>
                <Button title={'Login Or Sign Up'} theme={ButtonTheme.danger} onTap={() => {
                }}
                        icon={IoLogIn} style={{marginTop: 10}}></Button>
            </Card>
            </OnEnter>
        </div>
    </div>
}