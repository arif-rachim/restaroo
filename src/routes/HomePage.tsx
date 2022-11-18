import {Header} from "../components/page-components/Header";
import {Input} from "../components/page-components/Input";
import {useAppContext} from "../components/useAppContext";
import {StoreValue, useStore} from "../components/store/useStore";
import {dateToDdMmmYyyy} from "../components/page-components/utils/dateToDdMmmYyyy";
import {dateToHhMm} from "../components/page-components/utils/dateToHhMm";

export function HomePage() {
    const appContext = useAppContext();
    const store = useStore({dateTime: new Date()})
    return <div style={{paddingTop: 50}}>
        <Header title={'Home Page'}/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <StoreValue store={store} property={'value'} selector={s => dateToDdMmmYyyy(s.dateTime)}>
                <Input title={'Date'} titlePosition={'left'} titleWidth={50} placeholder={'Please select date'}
                       onFocus={async () => {
                           const value = await appContext.showPicker({picker: 'date', value: store.stateRef.current.dateTime});
                           store.setState({dateTime: value})
                       }} inputMode={'none'} readOnly={true}/>
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => dateToHhMm(s.dateTime)}>
                <Input title={'Time'} titlePosition={'left'} titleWidth={50} placeholder={'Please select time'}
                       onFocus={async () => {
                           const value = await appContext.showPicker({picker: 'time', value: store.stateRef.current.dateTime});
                           store.setState({dateTime: value})
                       }} inputMode={'none'} readOnly={true}/>
            </StoreValue>
        </div>
    </div>
}