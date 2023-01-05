import {Button, ButtonTheme, GuestProfile, Input, useProfile} from "@restaroo/lib";
import {IoLogIn} from "react-icons/io5";

export default function LoginPanel() {
    const user = useProfile();
    if (user === GuestProfile) {
        // well this is guest profile
    }
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }}>
        <div style={{display: 'flex', flexDirection: 'column', width: 350}}>
            <Input titlePosition={'left'} titleWidth={100} title={'Phone No'} placeholder={'0509018075'}/>
            <Button onTap={() => {
            }} title={'Request OTP'} icon={IoLogIn} theme={ButtonTheme.danger}></Button>
            <Input titlePosition={'left'} titleWidth={100} title={'OTP'} placeholder={'Please enter OTP'}/>
        </div>
    </div>
}