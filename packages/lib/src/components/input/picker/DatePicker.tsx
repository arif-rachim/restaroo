import {StoreValue, useAfterInit, useAppDimension, useStore} from "../../utils";
import {Button} from "../../page";
import {IoCalendar} from "react-icons/io5";
import {ButtonTheme} from "../../Theme";
import {KeyValue, Picker} from "./Picker";
import noNull from "../../utils/noNull";

const currentYear = new Date().getFullYear();

function dateToCalendar(value: Date) {
    const day = value.getDate() - 1;
    const month = value.getMonth();
    const year = currentYear - value.getFullYear();
    return {day, month, year, date: value};
}

function calendarToDate(props: { day: number, month: number, year: number, date: Date }) {
    const newDate = new Date(props.date.getTime());
    newDate.setFullYear(currentYear - props.year);
    newDate.setMonth(props.month);
    newDate.setDate(props.day + 1);
    return newDate;
}

const MONTHS: KeyValue[] = [
    {key: 0, value: 'January'},
    {key: 1, value: 'February'},
    {key: 2, value: 'March'},
    {key: 3, value: 'April'},
    {key: 4, value: 'May'},
    {key: 5, value: 'June'},
    {key: 6, value: 'July'},
    {key: 7, value: 'August'},
    {key: 8, value: 'September'},
    {key: 9, value: 'October'},
    {key: 10, value: 'November'},
    {key: 11, value: 'December'}
]

const YEARS: KeyValue[] = Array.from({length: 50}).map((_, index) => {
    const year = currentYear - index;
    return {
        key: index,
        value: `${year}`
    }
})
const defaultDate = new Date();
const nothing = () => {
};

export function DatePicker(props: { value?: Date, onChange?: (value: Date) => void }) {
    const value = noNull(props.value, defaultDate);
    const onChange = noNull(props.onChange, nothing);

    const store = useStore(() => dateToCalendar(value));
    useAfterInit(() => {
        const newState = dateToCalendar(value);
        store.set(newState);
    }, [value, store]);


    const {appDimension} = useAppDimension();
    return <div style={{
        display: 'flex', flexDirection: 'column',
        width: appDimension.width,
        backgroundColor: 'white'
    }}>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <StoreValue store={store} property={'value'} selector={s => s.day}>
                <Picker width={70}
                        data={Array.from({length: 31}).map((_, index) => ({key: index, value: `${index + 1}`}))}
                        onChange={day => store.set(old => ({...old, day}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.month}>
                <Picker data={MONTHS}
                        onChange={month => store.set(old => ({...old, month}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.year}>
                <Picker width={120} data={YEARS}
                        onChange={year => store.set(old => ({...old, year}))}
                />
            </StoreValue>
            <div style={{
                position: 'absolute',
                width: '100%',
                top: 150,
                height: 50,
                backgroundColor: 'rgba(0,0,0,0.1)'
            }}/>

        </div>

        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
            <Button title={'OK'} onTap={() => onChange(calendarToDate(store.get()))} icon={IoCalendar}
                    theme={ButtonTheme.promoted}/>
        </div>
    </div>
}
