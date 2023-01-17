import {
    Button,
    ButtonTheme,
    GuestProfile,
    RouteProps,
    useLogout,
    useProfile,
} from "@restaroo/lib";
import {IoSave} from "react-icons/io5";
import {pocketBase} from "../service";
import {Login} from "../components/Login";

export default function Home(props: RouteProps) {
    const profile = useProfile();
    const logout = useLogout(pocketBase);
    if (profile.id === GuestProfile.id) {
        return <Login />
    }
    return <div style={{width: '100%', height: '100%'}}>
        <Button title={'Hello World'} onTap={async () => {
            await logout();
        }} icon={IoSave} theme={ButtonTheme.danger}></Button>
    </div>
}
