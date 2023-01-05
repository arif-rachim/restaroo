import {RouteProps} from "@restaroo/lib";
import LoginPanel from "../component/LoginPanel";

export default function Home(props: RouteProps) {
    return <div style={{width: '100%', height: '100%'}}>
        <LoginPanel/>
    </div>
}