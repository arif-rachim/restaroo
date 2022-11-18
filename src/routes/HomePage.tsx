import {Header} from "../components/page-components/Header";
import {Input} from "../components/page-components/Input";
import {useAppContext} from "../components/useAppContext";

export function HomePage() {
    const appContext = useAppContext();
    return <div style={{paddingTop: 50}}>
        <Header title={'Home Page'}/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Input title={'Date'} titlePosition={'left'} titleWidth={50} placeholder={'Please select date'} onFocus={async () => {
                const value = await appContext.showPicker({picker:'date',value:new Date()});
                alert('WE GOT VALUE ' + value.toISOString());
            }} inputMode={'none'}/>
            <Input title={'Time'} titlePosition={'left'} titleWidth={50}  placeholder={'Please select time'} onFocus={async () => {
                const value = await appContext.showPicker({picker:'time',value:new Date()});
                alert('WE GOT VALUE ' + value.toISOString());
            }} inputMode={'none'}/>
        </div>

    </div>
}