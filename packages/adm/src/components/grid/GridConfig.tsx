import {Card, CardTitle, Store, useAppStore} from "@restaroo/lib";
import {IoClose} from "react-icons/io5";
import {AppState} from "../../index";
import {useTable} from "../useTable";
import {ButtonSimple} from "../ButtonSimple";
import {PanelConfig} from "./Grid";

export function GridConfig(props: { closePanel: (param: any) => void, collection: string, configStore: Store<PanelConfig> }) {
    const {closePanel, collection, configStore} = props;

    const table = useTable(collection);

    const store = useAppStore<AppState>();

    return <Card style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    }}>
        <CardTitle title={collection}/>
        <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
            <ButtonSimple style={{border: '1px solid rgba(0,0,0,0.1)'}} onClick={() => {
                closePanel(false);
            }} title={'Close'} icon={IoClose}/>

        </div>

    </Card>
}