import {RouteConfig, useRouteConfig} from "../useRouteConfig";
import {useRouteProps} from "@restaroo/lib";
import {ButtonSimple} from "../ButtonSimple";
import {IoExitOutline} from "react-icons/io5";
export interface FormRouteConfig {

}
export function FormConfig(props:{closePanel:(param:false|RouteConfig<FormRouteConfig>) => void,config:RouteConfig<FormRouteConfig>}){
    const routeProps = useRouteProps();

    return <div style={{backgroundColor:'#FFF',height:'100%'}}>
        <ButtonSimple title={'Hello World'} icon={IoExitOutline} onClick={() => {
            props.closePanel(false);
        }} />
    </div>
}

