import {RouteProps} from "@restaroo/lib";
import {Button} from "antd";

export default function Home(props: RouteProps) {
    return <div style={{width: '100%', height: '100%'}}>
        <Button title={'Hello world'} >Hello world</Button>
    </div>
}